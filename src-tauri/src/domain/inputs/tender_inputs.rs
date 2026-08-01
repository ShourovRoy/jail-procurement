// all tender related inputs will be here
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// create tender inputs
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTenderInputs {
    pub jail_id: Uuid,
    pub tender_number: String,
    pub notice_number: String,
    pub estimated_amount: Decimal,
    pub remarks: String,
}

// tender details query command input
#[derive(Debug, Serialize, Deserialize)]
pub struct QueryTednerDetailsAndBids {
    pub tender_id: Uuid,
}
