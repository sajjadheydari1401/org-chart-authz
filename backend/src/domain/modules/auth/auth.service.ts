import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { SignupDto } from './dto/signup.dto.js';
import { ConfirmSMSDto } from './dto/confirm-sms.dto.js';
import { ProviderError } from '../../../common/filter/provider-error.js';

interface ProviderResponse {
  success?: boolean;
  message?: string;
  result?: {
    status_code?: number;
    message_developer?: { en?: string; fa?: string };
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  async signup(input: SignupDto): Promise<{ success: true }> {
    const url = this.config.getOrThrow<string>('AUTH_SIGNUP_URL');

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
    const url = this.config.getOrThrow<string>('AUTH_SIGNUP_URL');

    return this.postToProvider(url, {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
      username: input.username,
      code: input.code,
    });
  }

  private async postToProvider(
    url: string,
    body: Record<string, string>,
  ): Promise<{ success: true }> {
    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new ServiceUnavailableException();
    }

    const { data } = await axios.post<ProviderResponse>(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15_000,
      maxRedirects: 0,
    });

    if (data?.success === false) throw new ProviderError(data);
    if (data?.success !== true) throw new BadGatewayException();

    return { success: true };
  }
}
