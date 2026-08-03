// all payorder related services will be here

use std::sync::Arc;

use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

use crate::{
    domain::{inputs::pay_order_inputs::ReleasePayOrderInputs, models::global_model::ErrorModel},
    helpers::token_helper::retrive_verify_user_helper,
};

// release pay order service
pub async fn released_payorder_service(
    db_pool: &PgPool,
    auth_store: Arc<Store<Wry>>,
    payload: ReleasePayOrderInputs,
    secret: &str,
) -> Result<String, ErrorModel> {
    // verify the auth token
    let claims = retrive_verify_user_helper(auth_store, secret).await?;

    let q = "
    
        UPDATE pay_orders
        SET is_released = $1, released_by = $2, released_date = $3
        WHERE id = $4 AND participant_id = $5 AND is_released = false
    
    ";

    let res = sqlx::query(q)
        .bind(true)
        .bind(claims.user_id)
        .bind(payload.released_date)
        .bind(payload.pay_order_id)
        .bind(payload.participant_id)
        .execute(db_pool)
        .await
        .map_err(|release_pay_order_err| {
            dbg!(release_pay_order_err);
            ErrorModel {
                error_message: "Unable to release pay order!".to_string(),
                status_code: 500,
            }
        })?;

    // check if update not successful
    if res.rows_affected() == 0 {
        return Err(ErrorModel {
            status_code: 404,
            error_message: "Payorder already released or not exist!".to_string(),
        });
    }

    Ok("Pay order has been released!".to_string())
}
