// all pay order related models are defined here

use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

// Payorder model
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct PayOrder {
    id: Uuid,
    participant_id: Uuid,
    issuer_bank_name: String,
    issuer_bank_branch: String,
    pay_order_number: String,
    amount: Decimal,
    issue_date: NaiveDate,
    expiry_date: NaiveDate,
    is_released: bool,
    released_date: Option<NaiveDate>,
    released_by: Option<Uuid>,
    remarks: Option<String>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

// pay order with tender participant, released by
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct PayOrderWithParticipantReleasedByDetails<TP, RB> {
    #[sqlx(flatten)]
    pub pay_order: PayOrder,
    pub tender_participant: TP,
    pub released_by: RB,
}
