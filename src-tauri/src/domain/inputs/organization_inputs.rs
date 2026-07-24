// all organization inputs will be here

use serde::{Deserialize, Serialize};

// create organization inputs
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateOrganizationInput {
    pub name: String,
    pub proprietor_name: String,
    pub address: String,
    pub district: String,
    pub phone_number: String,
    pub email: String,
}
