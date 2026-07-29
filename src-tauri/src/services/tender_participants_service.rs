// all tender participant releted services will be declared here
use sqlx::PgPool;
use std::sync::Arc;
use tauri::Wry;
use tauri_plugin_store::Store;
use uuid::Uuid;

use crate::{
    domain::{
        inputs::tender_participant_inputs::CreateTenderParticipantInput,
        models::global_model::ErrorModel,
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
