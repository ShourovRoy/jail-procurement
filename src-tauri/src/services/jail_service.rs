// all jail related services will be here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

use crate::{
    domain::{
        inputs::jail_inputs::CreateJailInput,
        models::{global_model::ErrorModel, jail_model::JailWithCreator},
    },
    helpers::token_helper::retrive_verify_user_helper,
};

// create jail service
pub async fn create_jail_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
    payload: CreateJailInput,
) -> Result<String, ErrorModel> {
    // query to insert new jail into the database
    let q = "
        INSERT INTO jails (name, district, phone_number, address, created_by)
        VALUES ($1, $2, $3, $4, $5)
    ";

    // verify token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    let res = sqlx::query(q)
        .bind(payload.name)
        .bind(payload.district)
        .bind(payload.phone_number)
        .bind(payload.address)
        .bind(claims.user_id)
        .execute(db_pool)
        .await
        .map_err(|jail_creation_err| {
            // initialize default error_message and status_code
            let mut error_message: String = "Failed to create new jail!".to_string();
            let mut status_code: i32 = 500;

            // convert the error into sqlx database error
            let jail_err = jail_creation_err.as_database_error().unwrap();

            // check if error code exist
            if let Some(code) = jail_err.code() {
                // check if the code matched with duplicate key
                if code.to_string() == "23505".to_string() {
                    // udpate error_message and status_code
                    error_message = "Jail already exist!".to_string();
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
    Ok("Jail has been created successfully!".to_string())
}

// list all jails
pub async fn list_all_jail_service(
    db_pool: &PgPool,
    _auth_store: Arc<Store<Wry>>,
    _secret: &str,
) -> Result<Vec<JailWithCreator<String>>, ErrorModel> {
    let q = "
        SELECT 
            j.id, j.name, j.address, j.phone_number, j.created_by, j.created_at, j.updated_at,
            u.username AS creator
        FROM jails AS j 
        LEFT JOIN users AS u ON j.created_by=u.id 
    ";

    let jail_list = sqlx::query_as::<_, JailWithCreator<String>>(q)
        .fetch_all(db_pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Unable to query the jails!".to_string(),
            status_code: 500,
        })?;

    Ok(jail_list)
}
