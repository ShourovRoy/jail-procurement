// all payorders related inputs will be here

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// release payorder inputs
#[derive(Debug, Serialize, Deserialize)]
pub struct ReleasePayOrderInputs {
    pub pay_order_id: Uuid,
    pub participant_id: Uuid,
    pub released_date: DateTime<Utc>,
}
