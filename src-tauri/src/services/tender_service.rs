//  all tender related services will be defined here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

use crate::{
    domain::{inputs::tender_inputs::CreateTenderInputs, models::global_model::ErrorModel},
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
