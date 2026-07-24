// auth type definitions


// user role model
export enum UserRole {
  Admin = "Admin",
  Member = "Member",
}

// user model
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Login res definition
export interface LoginDataRes {
  auth_token: string | null,
  user: User | null
}
