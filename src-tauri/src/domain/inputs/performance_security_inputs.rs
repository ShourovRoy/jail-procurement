// all performance security related inputs will be here

// add performance security  inputs

use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct AddPerformanceSecurityInput {
    pub tender_id: Uuid,
    pub organization_id: Uuid,
    pub participant_id: Uuid,
    pub performance_security_number: String,
    pub amount: Decimal,
    pub issue_date: DateTime<Utc>,
    pub expiry_date: DateTime<Utc>,
    pub remarks: String,
}

// release performance security inputs
#[derive(Debug, Serialize, Deserialize)]
pub struct ReleasePerformanceSecurityInput {
    pub participant_id: Uuid,
    pub performance_security_id: Uuid,
    pub released_date: DateTime<Utc>,
}
