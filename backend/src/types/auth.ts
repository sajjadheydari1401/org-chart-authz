export interface ProviderSignupResponse {
  success: boolean;
  result: {
    username: string;
    systemId: string;
    roleName: string;
  };
  message: string;
  level: string;
}
