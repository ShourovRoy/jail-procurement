// all product related commands will be here

use tauri::AppHandle;

use crate::{
    domain::{
        inputs::products_input::CreateProductInput,
        models::global_model::{DataRes, ErrorModel, GlobalRes},
    },
    helpers::command_initializers::apphandler_auth_store_init,
    services::products_service::create_new_product_service,
};

// create new product command
#[tauri::command]
pub async fn create_new_product_command(
    app: AppHandle,
    input: CreateProductInput,
) -> Result<GlobalRes<(), ()>, GlobalRes<(), ErrorModel>> {
    let (state, db_pool, auth_store) = apphandler_auth_store_init(&app).await?;

    let res = create_new_product_service(&db_pool, auth_store, &state.env.token_secret, input)
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
