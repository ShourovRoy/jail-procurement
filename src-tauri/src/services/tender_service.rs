//  all tender related services will be defined here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;
use uuid::Uuid;

use crate::{
    domain::{
        inputs::tender_inputs::CreateTenderInputs,
        models::{
            global_model::ErrorModel, tender_model::TenderWithJailOrgWinnerCreator,
            tender_participant_model::TenderParticipantWithOrgOwnerCreator,
        },
        responses::tender_responses::{TenderDetailsWithBidsListRes, TenderListRes},
    },
    helpers::token_helper::retrive_verify_user_helper,
};

// create new tender service
pub async fn create_new_tender_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
    payload: CreateTenderInputs,
) -> Result<String, ErrorModel> {
    // query to insert tender into the tenders table
    let q = "
        INSERT INTO tenders (jail_id, tender_number, notice_number, estimated_amount, remarks, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
    ";

    // veryfiy auth token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    // insert the data into table
    let res = sqlx::query(q)
        .bind(payload.jail_id)
        .bind(payload.tender_number)
        .bind(payload.notice_number)
        .bind(payload.estimated_amount)
        .bind(payload.remarks)
        .bind(claims.user_id)
        .execute(db_pool)
        .await
        .map_err(|tender_err| {
            // initialize default error_message and status_code
            let mut error_message: String = "Failed to create new tender!".to_string();
            let mut status_code: i32 = 500;

            // convert the error into sqlx database error
            let jail_err = tender_err.as_database_error().unwrap();

            // check if error code exist
            if let Some(code) = jail_err.code() {
                // check if the code matched with duplicate key
                if code.to_string() == "23505".to_string() {
                    // udpate error_message and status_code
                    error_message = "Tender already exist!".to_string();
                    status_code = 409;
                }
            };

            // return error instance
            ErrorModel {
                error_message: error_message,
                status_code: status_code,
            }
        })?;

    // double check if nothing has changed return error
    if res.rows_affected() == 0 {
        return Err(ErrorModel {
            error_message: String::from("Failed to create new jail!"),
            status_code: 500,
        });
    }

    // return success message
    Ok("Tender has been created successfully!".to_string())
}

// query tender list service
pub async fn query_tender_list_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
) -> Result<TenderListRes<String, String, String>, ErrorModel> {
    // veryfiy auth token
    retrive_verify_user_helper(auth_store, secret).await?;

    // query the tenders

    let q = "
        SELECT 
            t.id, t.jail_id, t.tender_number, t.notice_number, t.dropping_date, t.opening_date, t.estimated_amount, t.winner_participant_id, t.winner_bid_amount, t.status, t.remarks, t.created_by, t.created_at, t.updated_at,

            j.name AS jail,
            o.name AS winner_organization,
            u.username AS creator
        FROM tenders as t
        LEFT JOIN jails AS j ON t.jail_id = j.id
        LEFT JOIN tender_participants AS tp ON t.winner_participant_id = tp.id
        LEFT JOIN organizations AS o ON tp.organization_id = o.id
        LEFT JOIN users AS u ON t.created_by = u.id
        ORDER BY t.created_at DESC
    ";

    // query the tender list
    let res = sqlx::query_as::<_, TenderWithJailOrgWinnerCreator<String, String, String>>(q)
        .fetch_all(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Unable to get the tenders list".to_string(),
            status_code: 500,
        })?;

    // return response
    Ok(TenderListRes { tenders: res })
}

// get tender details service with bids
pub async fn get_tender_details_with_bids_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
    tender_id: Uuid,
) -> Result<TenderDetailsWithBidsListRes, ErrorModel> {
    // veryfiy auth token
    retrive_verify_user_helper(auth_store, secret).await?;

    // query tender details statement
    let tender_details_q = "
        SELECT
            t.id, t.jail_id, t.tender_number, t.notice_number, t.dropping_date, t.opening_date, t.estimated_amount,
            t.winner_participant_id,
            t.winner_bid_amount, t.status, t.remarks, t.created_by, t.created_at, t.updated_at,
            j.name AS jail,
            o.name AS winner_organization,
            u.username AS creator
            
        FROM tenders AS t 
        LEFT JOIN jails AS j ON t.jail_id = j.id
        LEFT JOIN tender_participants AS tp ON t.winner_participant_id = tp.id
        LEFT JOIN organizations AS o ON tp.organization_id = o.id
        LEFT JOIN users AS u ON t.created_by = u.id
        WHERE t.id = $1
    ";

    let tender_participants_q = "
        SELECT  
            tp.id, tp.tender_id, tp.organization_id, tp.quoted_amount,
            tp.remarks, tp.created_by, tp.created_at, tp.updated_at,
            o.name AS organization,
			o.proprietor_name AS proprietor,
            u.username AS creator,
			po.id AS pay_order_id,
			po.pay_order_number AS pay_order_number,
			po.is_released AS pay_order_is_released
        FROM tender_participants as tp
        LEFT JOIN organizations AS o ON tp.organization_id = o.id
        LEFT JOIN users AS u ON tp.created_by = u.id
		LEFT JOIN pay_orders as po ON po.participant_id = tp.id
        WHERE tp.tender_id = $1
        ORDER BY tp.created_at DESC
    ";

    // execute tender details query
    let tender_details =
        sqlx::query_as::<_, TenderWithJailOrgWinnerCreator<String, String, String>>(
            tender_details_q,
        )
        .bind(tender_id)
        .fetch_one(db_pool)
        .await
        .map_err(|tender_query_err| {
            dbg!(tender_query_err);
            ErrorModel {
                status_code: 500,
                error_message: "Unable to get tender details!".to_string(),
            }
        })?;

    // execute the tender participants list query
    let participants = sqlx::query_as::<
        _,
        TenderParticipantWithOrgOwnerCreator<String, String, String>,
    >(tender_participants_q)
    .bind(tender_id)
    .fetch_all(db_pool)
    .await
    .map_err(|tender_query_err| {
        dbg!(tender_query_err);
        ErrorModel {
            status_code: 500,
            error_message: "Unable to get tender details!".to_string(),
        }
    })?;

    let data = TenderDetailsWithBidsListRes {
        tender: tender_details,
        participants,
    };

    Ok(data)
}
