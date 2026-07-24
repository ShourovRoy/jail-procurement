use tauri::State;

use crate::{
    domain::{
        inputs::signup_input::SignupInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
    },
    services,
    states::app_state::AppState,
};

// command to signup user
#[tauri::command]
pub async fn signup_user_command(
    state: State<'_, AppState>,
    input: SignupInput,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    let db_pool = state.db_pool.lock().await.clone();

    // business logic service
    if let Ok(res) = services::auth_service::signup_user_service(&db_pool, input).await {
        Ok(GlobalRes {
            success: Some(DataRes {
                message: res,
                data: None,
            }),
            error: None,
        })
    } else {
        Err(GlobalRes {
            success: None,
            error: Some(ErrorModel {
                status_code: 500,
                error_message: "Someting went wrong!".to_string(),
            }),
        })
    }
}
