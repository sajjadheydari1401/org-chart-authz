export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  mobile_number: string;
  systemUsername: string;
  systemPassword: string;
  roleName: string;
  smsTemplate: string;
  patternName: string;
  smsSystemName: string;
}

export interface SignupResponse {
  success: boolean;
  result: unknown;
  message: string;
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
