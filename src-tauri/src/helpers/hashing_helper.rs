use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2, PasswordHash, PasswordVerifier,
};

use crate::domain::models::global_model::ErrorModel;

// hash password
pub async fn hash_password(password: &str) -> Result<String, ErrorModel> {
    let argon_hasher = Argon2::default();
    let salt = SaltString::generate(&mut OsRng);

    let hash = argon_hasher
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_err| ErrorModel {
            error_message: "Unable to hash the password!".to_string(),
            status_code: 500,
        })?
        .to_string();

    Ok(hash)
}

// verify the password
pub async fn verify_password(password: String, pwd_hash: &str) -> Result<bool, ErrorModel> {
    let argon_hasher = Argon2::default();
    let parsed_hash = PasswordHash::new(pwd_hash).map_err(|_err| ErrorModel {
        status_code: 500,
        error_message: "Unable to parse password! Contact support.".to_string(),
    })?;
    if let Err(_err) = argon_hasher.verify_password(password.as_bytes(), &parsed_hash) {
        
        
        return Err(ErrorModel {
            status_code: 401,
            error_message: "Invalid credientials!".to_string(),
        });
    }

    Ok(true)
}
