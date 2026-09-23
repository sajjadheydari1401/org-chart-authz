export interface SignupRequest {
  email: string;
  password: string;
  mobile: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifySmsRequest {
  mobile: string;
  code: string;
}

export interface AuthTokenResponse {
  accessToken: string;
}

export interface AuthActionSuccess {
  success: true;
}

export interface AuthActionError {
  success: false;
  message: string;
  fieldErrors?: Record<string, string>;
}

export type AuthActionResult = AuthActionSuccess | AuthActionError;
