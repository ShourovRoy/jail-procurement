// all tender participant releted commands

use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreBuilder;

use crate::{
    domain::{
        inputs::tender_participant_inputs::{
            CreateTenderParticipantInput, TenderParticipantDetailsInput,
            TenderParticipantWinnerInput,
        },
        models::global_model::{DataRes, ErrorModel, GlobalRes},
        responses::tender_participant_responses::TenderParticipantDetailsRes,
    },
    services::tender_participants_service::{
        add_tender_participants, assign_tender_participant_winner_service,
        get_tender_participant_details,
    },
    states::app_state::AppState,
};

// add participant command
#[tauri::command]
pub async fn add_participant_command(
    app: AppHandle,
    input: CreateTenderParticipantInput,
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

    // add bids to tender service
    let res = add_tender_participants(db_pool, auth_store, input, &state.env.token_secret)
        .await
        .map_err(|err| GlobalRes {
            success: None,
            error: Some(err),
        })?;

    // return success message
    Ok(GlobalRes {
        success: Some(DataRes {
            data: None,
            message: res,
        }),
        error: None,
    })
}

// tender participant details command
#[tauri::command]
pub async fn tender_participant_details_command(
    app: AppHandle,
    input: TenderParticipantDetailsInput,
) -> Result<GlobalRes<TenderParticipantDetailsRes, ()>, GlobalRes<(), ErrorModel>> {
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

    // get tender participant details service
    let tender_participant_details = get_tender_participant_details(
        db_pool,
        auth_store,
        input.tender_participant_id,
        &state.env.token_secret,
    )
    .await
    .map_err(|err| GlobalRes {
        success: None,
        error: Some(err),
    })?;

    Ok(GlobalRes {
        success: Some(DataRes {
            data: Some(tender_participant_details),
            message: "Tender participant details command executed successfully!".to_string(),
        }),
        error: None,
    })
}

// assign participant as winner command
#[tauri::command]
pub async fn assign_tender_participant_winner(
    app: AppHandle,
    input: TenderParticipantWinnerInput,
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

    // assign winner service
    let res = assign_tender_participant_winner_service(
        db_pool,
        auth_store,
        input.tender_participant_id,
        input.tender_id,
        &state.env.token_secret,
    )
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
