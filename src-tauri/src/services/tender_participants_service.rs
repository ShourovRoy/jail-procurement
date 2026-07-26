// all tender participant releted services will be declared here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

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
    // query to insert participant tender bid
    let q = "
        INSERT INTO tender_participants (tender_id, organization_id, quoted_amount, bid_submission_date, remarks, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
    ";

    // veryfiy auth token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    // exec the sql query
    let res = sqlx::query(q)
        .bind(payload.tender_id)
        .bind(payload.organization_id)
        .bind(payload.quoted_amount)
        .bind(payload.bid_submission_date)
        .bind(payload.remarks)
        .bind(claims.user_id)
        .execute(db_pool)
        .await
        .map_err(|tender_participant_err| {
            dbg!(&tender_participant_err);

            // initialize default error_message and status_code
            let mut error_message: String = "Failed to add bid!".to_string();
            let mut status_code: i32 = 500;

            // convert the error into sqlx database error
            let tender_participant_err = tender_participant_err.as_database_error().unwrap();

            // check if error code exist
            if let Some(code) = tender_participant_err.code() {
                // check if the code matched with duplicate key
                if code.to_string() == "23505".to_string() {
                    // udpate error_message and status_code
                    error_message = "The organization already bided for the tender!".to_string();
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
    Ok("Bid has been added successfully!".to_string())
}
