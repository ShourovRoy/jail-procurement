// all organization related services will be here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;
use uuid::Uuid;

use crate::{
    domain::{
        inputs::organization_inputs::CreateOrganizationInput,
        models::{global_model::ErrorModel, organization_model::Organization},
    },
    helpers::token_helper::retrive_verify_user_helper,
};

// create organization service
pub async fn create_organization_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
    payload: CreateOrganizationInput,
) -> Result<String, ErrorModel> {
    // query to insert organzation in db
    let q = "
        INSERT INTO organizations (name, proprietor_name, address, district, phone_number, email, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
    ";

    // veryfiy auth token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    // insert values into table db
    let res = sqlx::query(q)
        .bind(payload.name)
        .bind(payload.proprietor_name)
        .bind(payload.address)
        .bind(payload.district)
        .bind(payload.phone_number)
        .bind(payload.email)
        .bind(claims.user_id)
        .execute(db_pool)
        .await
        .map_err(|org_creation_err| {
            // initialize default error_message and status_code
            let mut error_message: String = "Failed to create new organization!".to_string();
            let mut status_code: i32 = 500;

            // convert the error into sqlx database error
            let jail_err = org_creation_err.as_database_error().unwrap();

            // check if error code exist
            if let Some(code) = jail_err.code() {
                // check if the code matched with duplicate key
                if code.to_string() == "23505".to_string() {
                    // udpate error_message and status_code
                    error_message = "Organization already exist!".to_string();
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

// filter org list query service
pub async fn query_organization_list_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    secret: &str,
) -> Result<Vec<Organization<Uuid>>, ErrorModel> {
    // query to list organzations
    let q = "
            SELECT * FROM organizations AS o ORDER BY o.created_at ASC
        ";

    // veryfiy auth token and get claims
    retrive_verify_user_helper(auth_store, secret).await?;

    // execute the query
    let res = sqlx::query_as::<_, Organization<Uuid>>(q)
        .fetch_all(db_pool)
        .await
        .map_err(|org_query_err| {
            dbg!(org_query_err);
            ErrorModel {
                status_code: 500,
                error_message: "Unable to query organizations!".to_string(),
            }
        })?;

    Ok(res)
}
