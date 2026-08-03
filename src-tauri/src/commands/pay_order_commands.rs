// all the pay orders related commands

use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::{
        inputs::pay_order_inputs::ReleasePayOrderInputs,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
    },
    services::pay_order_service::released_payorder_service,
    states::app_state::AppState,
};

// release pay order command
#[tauri::command]
pub async fn release_pay_order_command(
    app: AppHandle,
    input: ReleasePayOrderInputs,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    // app state
    let state = app.state::<AppState>();

    dbg!(&input);
    // database pool
    let db_pool = &state.db_pool.lock().await.clone();

    // auth store
    let auth_store = StoreBuilder::new(&app, "auth_store.json")
        .build()
        .map_err(|_err| GlobalRes {
            success: None,
            error: Some(ErrorModel {
                error_message: "Unable to access auth store!".to_string(),
                status_code: 500,
            }),
        })?;

    let res = released_payorder_service(db_pool, auth_store, input, &state.env.token_secret)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            data: None,
            message: res,
        }),
        error: None,
    })
}
