// all products related inputs will be here

use serde::{Deserialize, Serialize};
use uuid::Uuid;

// create product input
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProductInput {
    pub name: String,
    pub unit_id: Uuid,
    pub description: String,
}
