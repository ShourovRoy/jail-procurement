use std::sync::Arc;

use sqlx::PgPool;
use tauri::{AppHandle, Manager, State, Wry};
use tauri_plugin_store::{Store, StoreBuilder};

use crate::{
    domain::models::global_model::{ErrorModel, GlobalRes},
    states::app_state::AppState,
};

// initialize app handle and secrect auth store for commands and return
pub async fn apphandler_auth_store_init(
    app: &AppHandle,
) -> Result<(State<'_, AppState>, PgPool, Arc<Store<Wry>>), GlobalRes<(), ErrorModel>> {
    // app state
    let state = app.state::<AppState>();

    // dbg!(&input);
    // database pool
    let db_pool = state.db_pool.lock().await.clone();

    // auth store
    let auth_store = StoreBuilder::new(app, "auth_store.json")
        .build()
        .map_err(|_err| GlobalRes {
            success: None,
            error: Some(ErrorModel {
                error_message: "Unable to access auth store!".to_string(),
                status_code: 500,
            }),
        })?;

    Ok((state, db_pool, auth_store))
}
