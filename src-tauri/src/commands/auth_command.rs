// commands for retriving auth token from store and verification

use tauri::{AppHandle, State};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::models::global_model::ErrorModel,
    helpers::token_helper::{retrive_verify_user_helper, AuthTokenClaims},
    states::app_state::AppState,
};

// retrive and verify token command
#[tauri::command]
pub async fn retrive_verify_auth_token(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<AuthTokenClaims, ErrorModel> {
    let auth_store = StoreBuilder::new(&app, "auth_store.json")
        .auto_save(std::time::Duration::from_millis(100))
        .build()
        .map_err(|_| ErrorModel {
            status_code: 500,
            error_message: "Internal server error! Contact support".to_string(),
        })?;

    let claims = retrive_verify_user_helper(auth_store, &state.env.token_secret).await?;

    Ok(claims)
}
