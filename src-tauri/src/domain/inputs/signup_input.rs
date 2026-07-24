use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct SignupInput {
    pub username: String,
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub password: String,
}
