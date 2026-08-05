// all the performance security services will be here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

use crate::{
    domain::{
        inputs::performance_security_inputs::{
            AddPerformanceSecurityInput, ReleasePerformanceSecurityInput,
        },
        models::{global_model::ErrorModel, pay_order_model::PayOrder},
    },
    helpers::token_helper::retrive_verify_user_helper,
};

// add performance security
pub async fn add_performance_security_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    payload: AddPerformanceSecurityInput,
    secret: &str,
) -> Result<String, ErrorModel> {
    // insert query statement to insert performance security
    let q: &str = "
        INSERT INTO performance_security (tender_id, organization_id, participant_id, issuer_bank_name, issuer_bank_branch, performance_security_number, amount, issue_date, expiry_date, remarks)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ";

    // get payorder details statement
    let pay_order_q = "

        SELECT * FROM pay_orders
        WHERE participant_id = $1
    
    ";

    // veryfiy auth token and get claims
    retrive_verify_user_helper(auth_store, secret).await?;

    // get payorder details
    let pay_order = sqlx::query_as::<_, PayOrder>(pay_order_q)
        .bind(payload.participant_id)
        .fetch_one(db_pool)
        .await
        .map_err(|pay_order_in_performance_security_db_err| {
            dbg!(pay_order_in_performance_security_db_err);
            ErrorModel {
                error_message: "Participant didn't submit his pay order before!".to_string(),
                status_code: 400,
            }
        })?;

    let res = sqlx::query(q)
        .bind(payload.tender_id)
        .bind(payload.organization_id)
        .bind(payload.participant_id)
        .bind(pay_order.issuer_bank_name)
        .bind(pay_order.issuer_bank_branch)
        .bind(payload.performance_security_number)
        .bind(payload.amount)
        .bind(payload.issue_date)
        .bind(payload.expiry_date)
        .bind(payload.remarks)
        .execute(db_pool)
        .await
        .map_err(|performance_security_creation_db_err| {
            dbg!(&performance_security_creation_db_err);
            // initialize default error_message and status_code
            let mut error_message: String = "Failed to add performance security!".to_string();
            let mut status_code: i32 = 500;

            // convert the error into sqlx database error
            let po_err = performance_security_creation_db_err
                .as_database_error()
                .unwrap();

            // check if error code exist
            if let Some(code) = po_err.code() {
                // check if the code matched with duplicate key
                if code.to_string() == "23505".to_string() {
                    // udpate error_message and status_code
                    error_message = "Performance security already used!".to_string();
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
            error_message: "Unable to add Performance Security".to_string(),
            status_code: 500,
        });
    }

    Ok("Performance security has been added".to_string())
}

// release performance security
pub async fn release_performance_security_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    payload: ReleasePerformanceSecurityInput,
    secret: &str,
) -> Result<String, ErrorModel> {
    // query statement to release performance security
    let q = "

        UPDATE performance_security
            SET is_released = $1, released_date = $2, released_by = $3
        WHERE id = $4 AND participant_id = $5 AND is_released = FALSE
    
    ";

    // veryfiy auth token and get claims
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    // release the performance security query
    let res = sqlx::query(q)
        .bind(true)
        .bind(payload.released_date)
        .bind(claims.user_id)
        .bind(payload.performance_security_id)
        .bind(payload.participant_id)
        .execute(db_pool)
        .await
        .map_err(|release_ps_db_err| {
            dbg!(release_ps_db_err);
            ErrorModel {
                error_message: "Failed to release the performance security!".to_string(),
                status_code: 500,
            }
        })?;

    // check if update not successful
    if res.rows_affected() == 0 {
        return Err(ErrorModel {
            status_code: 404,
            error_message: "Performance security already released or not exist!".to_string(),
        });
    }

    Ok("Performance security has been released.".to_string())
}
