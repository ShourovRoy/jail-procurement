//  all jail related responses will be here

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::domain::models::jail_model::JailWithCreator;

// list jail response
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct JailListRes<T> {
    pub jails: Vec<JailWithCreator<T>>,
}
