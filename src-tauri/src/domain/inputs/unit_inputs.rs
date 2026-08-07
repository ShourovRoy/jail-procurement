// all unit inputs are going to be here

use serde::{Deserialize, Serialize};

// create new unit input
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUnitInput {
    pub name: String,
    pub short_name: String,
}
