export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  mobile: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface VerifySmsRequest {
  code: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  username: string;
  userId: string;
}

export interface AuthUser {
  username: string;
  userId: string;
}

export interface AuthActionSuccess {
  success: true;
  message?: string;
  user?: AuthUser;
}

export interface AuthActionError {
  success: false;
  message: string;
  fieldErrors?: Record<string, string>;
}

export type AuthActionResult = AuthActionSuccess | AuthActionError;
