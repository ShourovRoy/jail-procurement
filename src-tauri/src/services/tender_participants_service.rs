// all tender participant releted services will be declared here
use sqlx::PgPool;
use std::sync::Arc;
use tauri::Wry;
use tauri_plugin_store::Store;
use uuid::Uuid;

use crate::{
    domain::{
        inputs::tender_participant_inputs::CreateTenderParticipantInput,
        models::{
            global_model::ErrorModel, jail_model::JailV2, organization_model::Organization,
            pay_order_model::PayOrder, tender_model::Tender,
            tender_participant_model::TenderParticipant, user_model::User,
        },
        responses::tender_participant_responses::TenderParticipantDetailsRes,
    },
    helpers::token_helper::retrive_verify_user_helper,
};

// add tender participant service
pub async fn add_tender_participants(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    payload: CreateTenderParticipantInput,
    secret: &str,
) -> Result<String, ErrorModel> {
    // db  pool transaction instance
    let mut tx = db_pool
        .begin()
        .await
        .map_err(|_transatcion_pool_instance_err| ErrorModel {
            error_message: "Internal server error!".to_string(),
            status_code: 500,
        })?;

    // query to insert participant tender bid
    let tender_participant_q = "
        INSERT INTO tender_participants (tender_id, organization_id, quoted_amount, bid_submission_date, remarks, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    ";

    // query to insert payorder which associates with tender bid
    let pay_order_q = "
        INSERT INTO pay_orders (participant_id, issuer_bank_name, issuer_bank_branch, pay_order_number, amount, issue_date, expiry_date, remarks)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    ";

    // veryfiy auth token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    // database transaction phase starts here
    // exec the sql query
    let tender_participant_res = sqlx::query_scalar::<_, Uuid>(tender_participant_q)
        .bind(payload.tender_id)
        .bind(payload.organization_id)
        .bind(payload.quoted_amount)
        .bind(payload.bid_submission_date)
        .bind(&payload.remarks)
        .bind(claims.user_id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|tender_participant_err| {
            dbg!(&tender_participant_err);

            // initialize default error_message and status_code
            let mut error_message: String = "Failed to add bid!".to_string();
            let mut status_code: i32 = 500;

            if let Some(db_err) = tender_participant_err.as_database_error() {
                if let Some(code) = db_err.code() {
                    if code == "23505" {
                        error_message =
                            "The organization already bided for the tender!".to_string();
                        status_code = 409;
                    }
                }
            }

            // return error instance
            ErrorModel {
                error_message: error_message,
                status_code: status_code,
            }
        })?;

    // unwrap the tender participant id
    if let Some(participant_id) = tender_participant_res {
        // create pay order record in db with the tender participant id

        sqlx::query(pay_order_q)
            .bind(participant_id)
            .bind(payload.issuer_bank_name)
            .bind(payload.issuer_bank_branch)
            .bind(payload.pay_order_number)
            .bind(payload.pay_order_amount)
            .bind(payload.pay_order_issue_date)
            .bind(payload.pay_order_expiry_date)
            .bind(payload.remarks)
            .execute(&mut *tx)
            .await
            .map_err(|pay_order_db_insert_err| {

                // initialize default error_message and status_code
                let mut error_message: String =
                    "Unable to process pay order! Please try again".to_string();
                let mut status_code: i32 = 500;

                if let Some(db_err) = pay_order_db_insert_err.as_database_error() {
                    if let Some(code) = db_err.code() {
                        if code == "23505" {
                            error_message =
                                "The organization already bided for the tender or the pay-order already in use!".to_string();
                            status_code = 409;
                        }
                    }
                }

                // return error instance
                ErrorModel {
                    error_message: error_message,
                    status_code: status_code,
                }
            })?;
    }

    // commit the changes if everything went well
    tx.commit().await.map_err(|_err| ErrorModel {
        error_message: "Internal server error!".to_string(),
        status_code: 500,
    })?;

    // return success message
    Ok("Bid has been added successfully!".to_string())
}

// get tender participant details service
pub async fn get_tender_participant_details(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    tender_participant_id: Uuid,
    secret: &str,
) -> Result<TenderParticipantDetailsRes, ErrorModel> {
    // verify the auth token
    retrive_verify_user_helper(auth_store, secret).await?;

    // query to get tender participant details
    let tender_particiant_details_q = "
        SELECT 
            *
        FROM tender_participants AS tp
        WHERE tp.id = $1    
    ";

    // tender details query
    let tender_details_q = "
        SELECT 
            * 
        FROM tenders WHERE id = $1
    ";

    // jails details query
    let jail_details_q = "
        SELECT 
            * 
        FROM jails 
        WHERE id = $1
    ";

    // organization details query
    let organization_details_q = "
        SELECT 
            * 
        FROM organizations 
        WHERE id = $1
    ";

    // creator details query
    let creator_details_q = "
            SELECT 
                * 
            FROM users 
            WHERE id = $1
        ";

    // pay order details query
    let pay_order_details_q = "
        SELECT 
            *
        FROM pay_orders WHERE participant_id = $1
    ";

    // fetch tender participant details
    let tender_participant = sqlx::query_as::<_, TenderParticipant>(tender_particiant_details_q)
        .bind(tender_participant_id)
        .fetch_one(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Failed to fetch tender participant details!".to_string(),
            status_code: 500,
        })?;

    // fetch tender details
    let tender_details = sqlx::query_as::<_, Tender>(tender_details_q)
        .bind(&tender_participant.tender_id)
        .fetch_one(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Failed to fetch tender details!".to_string(),
            status_code: 500,
        })?;

    // fetch jail details
    let jail_details = sqlx::query_as::<_, JailV2>(jail_details_q)
        .bind(&tender_details.jail_id)
        .fetch_one(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Failed to fetch jail details!".to_string(),
            status_code: 500,
        })?;

    // fetch organization details
    let organization_details = sqlx::query_as::<_, Organization>(organization_details_q)
        .bind(&tender_participant.organization_id)
        .fetch_one(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Failed to fetch organization details!".to_string(),
            status_code: 500,
        })?;

    // fetch creator details
    let creator_details = sqlx::query_as::<_, User>(creator_details_q)
        .bind(&tender_participant.created_by)
        .fetch_one(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Failed to fetch creator details!".to_string(),
            status_code: 500,
        })?;

    // fetch pay order details
    let pay_order_details = sqlx::query_as::<_, PayOrder>(pay_order_details_q)
        .bind(&tender_participant_id)
        .fetch_one(db_pool)
        .await
        .map_err(|err| {
            dbg!("payorder error: ", &err);

            ErrorModel {
                error_message: "Failed to fetch pay order details!".to_string(),
                status_code: 500,
            }
        })?;

    let data = TenderParticipantDetailsRes {
        tender_participant,
        tender: tender_details,
        jail: jail_details,
        organization: organization_details,
        creator: creator_details,
        pay_order: pay_order_details,
    };

    dbg!(&data);

    Ok(data)
}
