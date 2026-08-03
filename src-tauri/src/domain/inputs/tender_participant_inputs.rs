// all tender participant related inputs will be declared here

use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// create tender participant input struct
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTenderParticipantInput {
    pub tender_id: Uuid,
    pub organization_id: Uuid,
    pub quoted_amount: Decimal,
    pub bid_submission_date: DateTime<Utc>,
    pub remarks: String,
    pub issuer_bank_name: String,
    pub issuer_bank_branch: String,
    pub pay_order_number: String,
    pub pay_order_expiry_date: DateTime<Utc>,
    pub pay_order_issue_date: DateTime<Utc>,
    pub pay_order_amount: Decimal,
}

// tender participant details input struct
#[derive(Debug, Serialize, Deserialize)]
pub struct TenderParticipantDetailsInput {
    pub tender_participant_id: Uuid,
}

// tender participant winner inpute
#[derive(Debug, Serialize, Deserialize)]
pub struct TenderParticipantWinnerInput {
    pub tender_participant_id: Uuid,
    pub tender_id: Uuid,
}
