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
}
