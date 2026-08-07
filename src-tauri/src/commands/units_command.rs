// all units related commands will be here

use tauri::AppHandle;

use crate::{
    domain::{
        inputs::unit_inputs::CreateUnitInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
        responses::unit_responses::UnitListRes,
    },
    helpers::command_initializers::apphandler_auth_store_init,
    services::unit_service::{create_new_unit_service, list_all_units_service},
};

// create new unit command
#[tauri::command]
pub async fn create_new_unit_command(
    app: AppHandle,
    input: CreateUnitInput,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    // init state, db_pool and auth_store
    let (state, db_pool, auth_store) = apphandler_auth_store_init(&app).await?;

    // create new unit service
    let res = create_new_unit_service(&db_pool, auth_store, &state.env.token_secret, input)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            message: res,
            data: None,
        }),
        error: None,
    })
}

// get all units list command
#[tauri::command]
pub async fn get_all_units_command(
    app: AppHandle,
) -> Result<GlobalRes<UnitListRes<String>, ()>, GlobalRes<(), ErrorModel>> {
    let (state, db_pool, auth_store) = apphandler_auth_store_init(&app).await?;

    let units = list_all_units_service(&db_pool, auth_store, &state.env.token_secret)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            message: "Ok".to_string(),
            data: Some(UnitListRes { units }),
        }),
        error: None,
    })
}
