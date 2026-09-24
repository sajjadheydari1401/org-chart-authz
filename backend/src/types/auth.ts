export interface AuthResponse<T> {
  success: boolean;
  result: T;
  message: string;
  level?: string;
}

export type SignupSuccessResult = {
  username: string;
  systemId: string;
  roleName: string;
};

export type AuthErrorResult = {
  success: boolean;
  status_code: number;
  timestamp: string;
  path: string;
  message_developer: {
    fa: string;
    en: string;
  };
};
