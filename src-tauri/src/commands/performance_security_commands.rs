// all performance security related commands will be here

use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::{
        inputs::performance_security_inputs::AddPerformanceSecurityInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
    },
    services::performance_security_service::add_performance_security_service,
    states::app_state::AppState,
};

// add performance security command
#[tauri::command]
pub async fn add_performance_security_command(
    app: AppHandle,
    input: AddPerformanceSecurityInput,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    // app state
    let state = app.state::<AppState>();

    // dbg!(&input);
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

    // add performance security service
    let res = add_performance_security_service(db_pool, auth_store, input, &state.env.token_secret)
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
