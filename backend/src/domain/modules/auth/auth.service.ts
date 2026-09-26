import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SignupDto } from './dto/signup.dto.js';
import { ConfirmSMSDto } from './dto/confirm-sms.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ProviderError } from '../../../common/filter/provider-error.js';
import { AppApi } from '../../../common/utils/api/AppApi.js';

interface ProviderResponse {
  success?: boolean;
  message?: string;
  result?: {
    status_code?: number;
    message_developer?: { en?: string; fa?: string };
    username?: string;
    userId?: string;
    accessToken?: string;
    access_token?: string;
    token?: string;
  };
  accessToken?: string;
  access_token?: string;
  token?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  async signup(input: SignupDto): Promise<{ success: true }> {
    const url = this.providerUrl('/auth/2FA_register_UP');

    return this.postToProvider(url, {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
      roleName: this.config.getOrThrow<string>('AUTH_ROLE_NAME'),
      smsTemplate: this.config.getOrThrow<string>('AUTH_SMS_TEMPLATE'),
      patternName: this.config.getOrThrow<string>('AUTH_PATTERN_NAME'),
      smsSystemName: this.config.getOrThrow<string>('AUTH_SMS_SYSTEM_NAME'),
      email: input.email,
      username: input.username,
      password: input.password,
      mobile_number: input.mobile,
    });
  }

  async confirmSms(input: ConfirmSMSDto): Promise<{ success: true }> {
    const url = this.providerUrl('/auth/register/confirm');

    return this.postToProvider(url, {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
      username: input.username,
      code: input.code,
    });
  }

  async login(input: LoginDto): Promise<{
    accessToken: string;
    username: string;
    userId: string;
  }> {
    const url = this.providerUrl('/auth/login_UP');
    const { data } = await AppApi.post<ProviderResponse>(url, {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
      roleName: this.config.getOrThrow<string>('AUTH_ROLE_NAME'),
      username: input.username,
      password: input.password,
    });

    if (data?.success === false) throw new ProviderError(data);
    if (data?.success !== true) throw new BadGatewayException();

    const accessToken = data.result?.token;
    const username = data.result?.username;
    const userId = data.result?.userId;

    if (
      typeof accessToken !== 'string' ||
      !accessToken.trim() ||
      typeof username !== 'string' ||
      !username.trim() ||
      typeof userId !== 'string' ||
      !userId.trim()
    ) {
      throw new BadGatewayException();
    }

    return { accessToken, username, userId };
  }

  private async postToProvider(
    url: string,
    body: Record<string, string>,
  ): Promise<{ success: true }> {
    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new ServiceUnavailableException();
    }

    const { data } = await AppApi.post<ProviderResponse>(url, body);

    if (data?.success === false) throw new ProviderError(data);
    if (data?.success !== true) throw new BadGatewayException();

    return { success: true };
  }

  private providerUrl(path: string): string {
    const baseUrl = this.config.getOrThrow<string>('AUTH_BASE_URL');
    return `${baseUrl.replace(/\/+$/, '')}${path}`;
  }
}
