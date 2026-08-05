// all performance security models will be here

use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

// Performance security model
#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct PerformanceSecurity {
    pub id: Uuid,
    pub tender_id: Uuid,
    pub organization_id: Uuid,
    pub participant_id: Uuid,
    pub issuer_bank_name: String,
    pub issuer_bank_branch: String,
    pub performance_security_number: String,
    pub amount: Decimal,
    pub issue_date: NaiveDate,
    pub expiry_date: NaiveDate,
    pub is_released: bool,
    pub released_date: Option<NaiveDate>,
    pub released_by: Option<Uuid>,
    pub remarks: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
