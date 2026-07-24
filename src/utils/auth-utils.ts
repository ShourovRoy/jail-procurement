

// auth utils

import { LoginDataRes } from "@/definitions/auth-definitions";
import { GlobalRes } from "@/definitions/global-definition";
import { invoke } from "@tauri-apps/api/core"


// signup inputs
export interface SignupInput {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}

// login inputs
export interface LoginInput {
  email: string;
  password: string;
}


// signup request command
export const signupCommand = async (payload: SignupInput): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("signup_user_command", {
    input: {
      username: payload.username,
      full_name: payload.full_name,
      email: payload.email,
      phone_number: payload.phone_number,
      password: payload.password
    }
  }).catch((err): GlobalRes<null> => {
    return err
  })


  return res
}


// login request command
export const loginCommand = async (payload: LoginInput): Promise<GlobalRes<LoginDataRes>> => {
  const res = await invoke<GlobalRes<LoginDataRes>>("login_user_command", {
    input: {
      email: payload.email,
      password: payload.password
    }
  }).catch((err): GlobalRes<LoginDataRes> => {
    return err
  })
  
  return res
}
