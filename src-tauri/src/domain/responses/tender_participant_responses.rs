// all tender participant related responses will be here

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::domain::models::{
    jail_model::JailV2, organization_model::Organization, tender_model::Tender,
    tender_participant_model::TenderParticipant, user_model::User,
};

// tender participant details response
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderParticipantDetailsRes {
    pub tender_participant: TenderParticipant,
    pub tender: Tender,
    pub jail: JailV2,
    pub organization: Organization,
    pub creator: User,
    pub pay_order: Option<String>,
}
