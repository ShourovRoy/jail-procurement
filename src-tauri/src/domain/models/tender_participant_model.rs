//  all tender participant related models will be here

use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

// tender participant model
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderParticipant {
    pub id: Uuid,
    pub tender_id: Uuid,
    pub organization_id: Uuid,
    pub quoted_amount: Decimal,
    pub remarks: String,
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderParticipantWithOrgOwnerCreator<O, P, U> {
    #[sqlx(flatten)]
    pub tender_participant: TenderParticipant,
    pub organization: O,
    pub proprietor: P,
    pub creator: U,
    pub pay_order_id: Uuid,
    pub pay_order_number: String,
    pub pay_order_is_released: bool,
}
