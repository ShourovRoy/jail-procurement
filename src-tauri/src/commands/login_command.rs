use tauri::{AppHandle, State};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::{
        inputs::login_input::LoginInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
        responses::auth_response::LoginDataRes,
    },
    services::auth_service::login_user_service,
    states::app_state::AppState,
};

#[tauri::command]
pub async fn login_user_command(
    app: AppHandle,
    state: State<'_, AppState>,
    input: LoginInput,
) -> Result<GlobalRes<LoginDataRes, ()>, GlobalRes<(), ErrorModel>> {
    let db_pool = state.db_pool.lock().await.clone();

    let auth_store = StoreBuilder::new(&app, "auth_store.json")
        .build()
        .map_err(|_err| GlobalRes {
            success: None,
            error: Some(ErrorModel {
                error_message: "Unable to access auth store!".to_string(),
                status_code: 500,
            }),
        })?;

    let user = login_user_service(&db_pool, input, auth_store.clone(), &state.env.token_secret)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            message: "Login successful.".to_string(),
            data: Some(user),
        }),
        error: None,
    })
}
