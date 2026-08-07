use std::sync::Arc;

// auth services business logic
use sqlx::PgPool;
use tauri::Wry;
use tauri_plugin_store::Store;

use crate::{
    domain::{
        inputs::{login_input::LoginInput, signup_input::SignupInput},
        models::{global_model::ErrorModel, user_model::User},
        responses::auth_response::LoginDataRes,
    },
    helpers::{
        hashing_helper::{hash_password, verify_password},
        token_helper::AuthTokenClaims,
    },
};

// login user service
pub async fn login_user_service(
    pool: &PgPool,
    payload: LoginInput,
    auth_store: Arc<Store<Wry>>,
    token_secret: &str,
) -> Result<LoginDataRes, ErrorModel> {
    // sql query for retriving user with email
    let q = "
    SELECT * FROM users WHERE email = $1;
    ";

    let user = sqlx::query_as::<_, User>(q)
        .bind(payload.email)
        .fetch_one(pool)
        .await
        .map_err(|_err| ErrorModel {
            error_message: "Invalid Crediantials!".to_string(),
            status_code: 401,
        })?;

    // compare the password
    if let Err(pass_err) = verify_password(payload.password, &user.password_hash).await {
        return Err(pass_err);
    }

    // create new auth token
    let mut auth_token_claim = AuthTokenClaims {
        role: user.role.clone(),
        user_id: user.id.clone(),
        exp: None,
    };

    let auth_token = auth_token_claim
        .generate_auth_token(token_secret)
        .await
        .map_err(|err| err)?;

    auth_store.set("auth_token", auth_token.clone());

    let data = LoginDataRes {
        auth_token: auth_token,
        user,
    };

    Ok(data)
}

// signup user service
pub async fn signup_user_service(
    pool: &PgPool,
    payload: SignupInput,
) -> Result<String, ErrorModel> {
    // sql query for creating user
    let q = "
    INSERT INTO users (username, password_hash, full_name, email, phone_number, role)
    VALUES ($1, $2, $3, $4, $5, 'admin')
  ";

    // hash the password

    let hashed_pwd = hash_password(&payload.password).await?;

    // exec for creating the user signup sql
    let res = sqlx::query(q)
        .bind(payload.username)
        .bind(hashed_pwd)
        .bind(payload.full_name)
        .bind(payload.email)
        .bind(payload.phone_number)
        .execute(pool)
        .await
        .map_err(|_db_err| ErrorModel {
            status_code: 500,
            error_message: "Unable to create user!".to_string(),
        })?;

    if res.rows_affected() > 0 {
        // On success
        Ok("Signup created successfully.".to_string())
    } else {
        // On Failed
        Err(ErrorModel {
            status_code: 502,
            error_message: "Unable to create user!".to_string(),
        })
    }
}
