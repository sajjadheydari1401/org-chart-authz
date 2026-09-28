export interface ProviderResponse<TResult> {
  success?: boolean;
  message?: string;
  result?: TResult & {
    status_code?: number;
    message_developer?: { en?: string; fa?: string };
  };
}
