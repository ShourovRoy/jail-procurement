use std::sync::Arc;

use chrono::Duration;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use tauri::Wry;
use tauri_plugin_store::Store;
use uuid::Uuid;

use crate::domain::models::{global_model::ErrorModel, user_model::UserRole};

/// Our claims struct, it needs to derive `Serialize` and/or `Deserialize`
#[derive(Debug, Serialize, Deserialize)]
pub struct AuthTokenClaims {
    pub exp: Option<usize>,
    pub user_id: Uuid,
    pub role: UserRole,
}

impl AuthTokenClaims {
    // generate expire time
    pub fn generate_exp_time(&mut self) {
        let exp_time = chrono::Utc::now() + Duration::hours(2);
        self.exp = Some(exp_time.timestamp() as usize);
    }

    // generate auth token method
    pub async fn generate_auth_token(&mut self, secret: &str) -> Result<String, ErrorModel> {
        // set expire time
        self.generate_exp_time();

        println!("exp time: {:?}", &self.exp);

        let auth_token = encode(
            &Header::default(),
            &self,
            &EncodingKey::from_secret(secret.as_ref()),
        )
        .map_err(|_err| ErrorModel {
            error_message: "Failed to generate auth session! Please try login again.".to_string(),
            status_code: 500,
        })?;

        Ok(auth_token)
    }
}

// verify and decode jwt auth token
pub async fn verify_decode_auth_token(
    auth_token: &str,
    secret: &str,
) -> Result<AuthTokenClaims, ErrorModel> {
    // Claims is a struct that implements Deserialize
    let data = decode::<AuthTokenClaims>(
        auth_token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_err| ErrorModel {
        status_code: 401,
        error_message: "Invalid session. Please login again!".to_string(),
    })?;

    Ok(data.claims)
}

// retrive auth token from store and verify it
pub async fn retrive_verify_user_helper(
    auth_store: Arc<Store<Wry>>,
    secret: &str,
) -> Result<AuthTokenClaims, ErrorModel> {
    if let Some(auth_token) = auth_store.get("auth_token") {
        if let Some(token) = auth_token.as_str() {
            // decode the token and return session error if session expired or invalid
            let token_claims = verify_decode_auth_token(token, secret)
                .await
                .map_err(|err| {
                    // delete the existing auth token
                    auth_store.delete("auth_token");

                    err
                })?;

            Ok(token_claims)
        } else {
            return Err(ErrorModel {
                status_code: 401,
                error_message: "Authorization error! Please login.".to_string(),
            });
        }
    } else {
        return Err(ErrorModel {
            status_code: 401,
            error_message: "Session expired! Please login.".to_string(),
        });
    }
}
