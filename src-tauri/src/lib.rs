use std::sync::Arc;

use tauri::{Manager, State};
use tauri_plugin_store::StoreBuilder;
use tokio::sync::Mutex;

use crate::states::app_state::{AppState, EnvVars};
mod commands;
mod database;
mod domain;
mod helpers;
mod services;
mod states;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn greet(state: State<'_, AppState>, name: &str) -> Result<String, ()> {
    let _db_pool = state.db_pool.lock().await.clone();

    Ok(format!("Hello, {}! You've been greeted from Rust!", name))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            tauri::async_runtime::block_on(async {
                let db = database::Database::new(
                    "postgresql://postgres@localhost:5432/jail-procurement-hello",
                )
                .await
                .expect("Unable to connect database!");

                let db_pool = Arc::new(Mutex::new(db.pool()));

                let app_state = AppState {
                    db_pool,
                    env: EnvVars {
                        token_secret: "S`HTEHA46U47IW57IK8O".to_string(),
                    },
                };
                app.manage(app_state)
            });

            let auth_store = StoreBuilder::new(app, "auth_store.json")
                .auto_save(std::time::Duration::from_millis(100))
                .build()?;

            // close auth store
            auth_store.close_resource();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::signup_command::signup_user_command,
            commands::login_command::login_user_command,
            commands::auth_command::retrive_verify_auth_token,
            commands::jail_commands::create_new_jail_command,
            commands::jail_commands::view_all_lists_command,
            commands::organization_commands::create_organization_command,
            commands::organization_commands::filter_organization_list_command,
            commands::tender_commands::create_tender_comamnd,
            commands::tender_commands::tender_list_comamnd,
            commands::tender_commands::tender_details_with_bids_command,
            commands::tender_participant_commands::add_participant_command,
            commands::tender_participant_commands::assign_tender_participant_winner,
            commands::tender_participant_commands::tender_participant_details_command,
            commands::pay_order_commands::release_pay_order_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
