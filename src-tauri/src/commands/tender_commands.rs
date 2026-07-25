//  all tender related commands will be here

use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::{
        inputs::tender_inputs::CreateTenderInputs,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
    },
    services::tender_service::create_new_tender_service,
    states::app_state::AppState,
};

// create new tender command
#[tauri::command]
pub async fn create_tender_comamnd(
    app: AppHandle,
    input: CreateTenderInputs,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    let state = app.state::<AppState>();

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

    let res = create_new_tender_service(db_pool, auth_store, &state.env.token_secret, input)
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
