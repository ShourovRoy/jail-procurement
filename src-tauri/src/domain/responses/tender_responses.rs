// all tender related responses will be here

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::domain::models::{
    tender_model::TenderWithJailOrgWinnerCreator,
    tender_participant_model::TenderParticipantWithOrgOwnerCreator,
};

// tenders list response
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderListRes<J, O, C> {
    pub tenders: Vec<TenderWithJailOrgWinnerCreator<J, O, C>>,
}

// tender details with bids list response
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderDetailsWithBidsListRes {
    pub tender: TenderWithJailOrgWinnerCreator<String, String, String>,
    pub participants: Vec<TenderParticipantWithOrgOwnerCreator<String, String, String>>,
}
