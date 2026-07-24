// all organization related models will be defined here

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct _Organization<T> {
    pub name: String,
    pub proprietor_name: String,
    pub address: String,
    pub district: String,
    pub phone_number: String,
    pub email: String,
    pub created_by: T,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
