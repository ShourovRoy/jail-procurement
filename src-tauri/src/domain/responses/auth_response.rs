use serde::{Deserialize, Serialize};

use crate::domain::models::user_model::User;

// Login response
#[derive(Debug, Serialize, Deserialize)]
pub struct LoginDataRes {
    pub user: User,
    pub auth_token: String,
}
