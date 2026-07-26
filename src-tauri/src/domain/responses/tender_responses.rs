// all tender related responses will be here

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::domain::models::tender_model::Tender;

// tenders list response
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TenderListRes<J, P, U> {
    pub tenders: Vec<Tender<J, P, U>>,
}
