// all unit services will be declared here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

use crate::{
    domain::{inputs::unit_inputs::CreateUnitInput, models::global_model::ErrorModel},
    helpers::token_helper::retrive_verify_user_helper,
};

// create new unit service
pub async fn create_new_unit_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
    payload: CreateUnitInput,
) -> Result<String, ErrorModel> {
    // statement to create unit

    let q = "

        INSERT INTO units (name, short_name, created_by)
        VALUES ($1, $2, $3) 
    
    ";

    // veryfiy auth token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    // execute the query to create unit
    let res = sqlx::query(q)
        .bind(payload.name)
        .bind(payload.short_name)
        .bind(claims.user_id)
        .execute(db_pool)
        .await
        .map_err(|unit_creation_db_err| {
            // initialize default error_message and status_code
            let mut error_message: String = "Failed to create new unit!".to_string();
            let mut status_code: i32 = 500;

            // convert the error into sqlx database error
            let unit_err = unit_creation_db_err.as_database_error().unwrap();

            // check if error code exist
            if let Some(code) = unit_err.code() {
                // check if the code matched with duplicate key
                if code.to_string() == "23505".to_string() {
                    // udpate error_message and status_code
                    error_message = "Unit already exist!".to_string();
                    status_code = 409;
                }
            };

            // return error instance
            ErrorModel {
                error_message: error_message,
                status_code: status_code,
            }
        })?;

    // check if rows reflected
    if res.rows_affected() == 0 {
        return Err(ErrorModel {
            status_code: 500,
            error_message: "Unable to create unit!".to_string(),
        });
    }

    Ok("Unit has been created.".to_string())
}
