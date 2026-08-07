// all unit related models will be here

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct UnitV2 {
    pub id: Uuid,
    pub name: String,
    pub short_name: String,
    pub created_by: Uuid,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct UnitWithCreator<T> {
    #[sqlx(flatten)]
    pub unit: UnitV2,
    pub creator: T,
}
