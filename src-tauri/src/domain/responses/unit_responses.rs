// all unit related responses will be here

use serde::{Deserialize, Serialize};

use crate::domain::models::unit_model::UnitWithCreator;

#[derive(Debug, Serialize, Deserialize)]
pub struct UnitListRes<T> {
    pub units: Vec<UnitWithCreator<T>>,
}
