// jail related all commands will be here

use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::{
        inputs::jail_inputs::CreateJailInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
        responses::jail_responses::JailListRes,
    },
    services::jail_service::{create_jail_service, list_all_jail_service},
    states::app_state::AppState,
};

// create new jail command
#[tauri::command]
pub async fn create_new_jail_command(
    app: AppHandle,
    input: CreateJailInput,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    // app state
    let state = app.state::<AppState>();
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

    // create new jail
    let jail_res_msg = create_jail_service(&db_pool, auth_store, &state.env.token_secret, input)
        .await
        .map_err(|jail_service_err| GlobalRes {
            success: None,
            error: Some(jail_service_err),
        })?;

    // return success
    Ok(GlobalRes {
        success: Some(DataRes {
            message: jail_res_msg,
            data: None,
        }),
        error: None,
    })
}

// view all jails list command
#[tauri::command]
pub async fn view_all_lists_command(
    app: AppHandle,
) -> Result<GlobalRes<JailListRes<String>, ()>, GlobalRes<(), ErrorModel>> {
    let state = app.state::<AppState>();
    let db_pool = state.db_pool.lock().await.clone();

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

    let jails = list_all_jail_service(&db_pool, auth_store, &state.env.token_secret)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            message: "Ok".to_string(),
            data: Some(JailListRes { jails }),
        }),
        error: None,
    })
}
