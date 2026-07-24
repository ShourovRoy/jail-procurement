use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorModel {
    pub status_code: i32,
    pub error_message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DataRes<T> {
    pub message: String,
    pub data: Option<T>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GlobalRes<S, E> {
    pub success: Option<DataRes<S>>,
    pub error: Option<E>,
}
