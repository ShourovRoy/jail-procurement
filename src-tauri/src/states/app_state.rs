// the application state

use std::sync::Arc;

use sqlx::PgPool;
use tokio::sync::Mutex;

#[derive(Debug)]
pub struct EnvVars {
    pub token_secret: String,
}

#[derive(Debug)]
pub struct AppState {
    pub env: EnvVars,
    pub db_pool: Arc<Mutex<PgPool>>,
}
