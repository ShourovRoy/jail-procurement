// all jail inputs will be here
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateJailInput {
    pub name: String,
    pub phone_number: String,
    pub address: String,
    pub district: String,
}
