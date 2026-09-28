import type { ConfigService } from '@nestjs/config';

export function systemCredentials(config: ConfigService): {
  systemUsername: string;
  systemPassword: string;
} {
  return {
    systemUsername: config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
    systemPassword: config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
  };
}

export function providerUrl(config: ConfigService, path: string): string {
  const baseUrl = config.getOrThrow<string>('AUTH_BASE_URL');
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
}
