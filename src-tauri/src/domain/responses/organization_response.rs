// all the orgs related responses will be defined here

use serde::{Deserialize, Serialize};

use crate::domain::models::organization_model::Organization;

// list of organzation response
#[derive(Debug, Serialize, Deserialize)]
pub struct OrganizationListRes<T> {
    pub organizations: Vec<Organization<T>>,
}
