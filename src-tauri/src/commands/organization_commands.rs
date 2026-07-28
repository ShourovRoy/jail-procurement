// all organization related commands here

use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreBuilder;
use uuid::Uuid;

use crate::{
    domain::{
        inputs::organization_inputs::CreateOrganizationInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
        responses::organization_response::OrganizationListRes,
    },
    services::organization_service::{
        create_organization_service, query_organization_list_service,
    },
    states::app_state::AppState,
};

// create new organization command
#[tauri::command]
pub async fn create_organization_command(
    app: AppHandle,
    input: CreateOrganizationInput,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    // app state
    let state = app.state::<AppState>();

    // db pool
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

    // create organization service
    let res = create_organization_service(&db_pool, auth_store, &state.env.token_secret, input)
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

// list filter all organization command
#[tauri::command]
pub async fn filter_organization_list_command(
    app: AppHandle,
) -> Result<GlobalRes<OrganizationListRes<Uuid>, ()>, GlobalRes<(), ErrorModel>> {
    // app state
    let state = app.state::<AppState>();

    // db pool
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

    let res = query_organization_list_service(db_pool, auth_store, &state.env.token_secret)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            message: "Ok".to_string(),
            data: Some(OrganizationListRes { organizations: res }),
        }),
        error: None,
    })
}
