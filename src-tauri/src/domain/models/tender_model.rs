// tender related models will be here

use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

// tender status
#[derive(Debug, sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "tender_status", rename_all = "lowercase")]
pub enum TenderStatus {
    Open,
    Awarded,
    Closed,
    Cancelled,
}

// tender model
// #[derive(Debug, Serialize, Deserialize, FromRow)]
// pub struct Tender<J, P, U> {
//     pub id: Uuid,
//     pub jail_id: J,
//     pub tender_number: String,
//     pub notice_number: String,
//     pub dropping_date: Option<DateTime<Utc>>,
//     pub opening_date: Option<DateTime<Utc>>,
//     pub estimated_amount: Decimal,
//     pub winner_participant_id: Option<P>,
//     pub winner_bid_amount: Decimal,
//     pub status: TenderStatus,
//     pub remarks: String,
//     pub created_by: U,
//     pub created_at: DateTime<Utc>,
//     pub updated_at: DateTime<Utc>,
// }

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Tender {
    pub id: Uuid,
    pub jail_id: Uuid,
    pub tender_number: String,
    pub notice_number: String,
    pub dropping_date: Option<DateTime<Utc>>,
    pub opening_date: Option<DateTime<Utc>>,
    pub estimated_amount: Decimal,
    pub winner_participant_id: Option<Uuid>,
    pub winner_bid_amount: Decimal,
    pub status: TenderStatus,
    pub remarks: String,
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderWithJailOrgWinnerCreator<J, O, C> {
    #[sqlx(flatten)]
    pub tender: Tender,
    pub jail: J,
    pub winner_organization: Option<O>,
    pub creator: C,
}
