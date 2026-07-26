//  all tender related services will be defined here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;
use uuid::Uuid;

use crate::{
    domain::{
        inputs::tender_inputs::CreateTenderInputs,
        models::{global_model::ErrorModel, tender_model::Tender},
        responses::tender_responses::TenderListRes,
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
            dbg!(&tender_err);

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
) -> Result<TenderListRes<Uuid, Uuid, String>, ErrorModel> {
    // veryfiy auth token
    retrive_verify_user_helper(auth_store, secret).await?;

    // query the tenders
    let q = "
        SELECT 
            t.id, t.jail_id, t.tender_number, t.notice_number, t.dropping_date, t.opening_date, t.estimated_amount, t.winner_participant_id, t.winner_bid_amount, t.status, t.remarks, u.username AS created_by, t.created_at, t.updated_at 
        FROM tenders AS t
        LEFT JOIN users AS u 
            on t.created_by = u.id
        ORDER BY t.created_at ASC;
    ";

    // query the tender list
    let res = sqlx::query_as::<_, Tender<Uuid, Uuid, String>>(q)
        .fetch_all(db_pool)
        .await
        .map_err(|err| {
            dbg!(err);
            ErrorModel {
                error_message: "Unable to get the tenders list".to_string(),
                status_code: 500,
            }
        })?;

    // return response
    Ok(TenderListRes { tenders: res })
}
