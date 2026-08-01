// all jail related models will be here

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct JailV2 {
    pub id: Uuid,
    pub name: String,
    pub address: String,
    pub phone_number: String,
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct JailWithCreator<T> {
    #[sqlx(flatten)]
    pub jail: JailV2,
    pub creator: T,
}
