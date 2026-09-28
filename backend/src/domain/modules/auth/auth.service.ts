import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SignupDto } from './dto/signup.dto.js';
import { ConfirmSMSDto } from './dto/confirm-sms.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ProviderError } from '../../../common/filter/provider-error.js';
import { LoginUpResult } from '../../../common/types/login-up-result.js';
import type { ProviderResponse } from '../../../common/types/provider-response.js';
import { TwoFARegisterUpResult } from '../../../common/types/two-fa-register-up-result.js';
import { AppApi } from '../../../common/utils/api/AppApi.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async signup(input: SignupDto): Promise<{ success: true }> {
    const url = this.providerUrl('/auth/2FA_register_UP');

    await this.postToProvider<TwoFARegisterUpResult>(url, {
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

    try {
      await this.usersService.createUser(input.username);
      return { success: true };
    } catch (error) {
      if (!(await this.deleteProviderUser(input.username))) {
        throw new ServiceUnavailableException();
      }

      throw error;
    }
  }

  async confirmSms(input: ConfirmSMSDto): Promise<{ success: true }> {
    const url = this.providerUrl('/auth/register/confirm');

    await this.postToProvider(url, {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
      username: input.username,
      code: input.code,
    });

    return { success: true };
  }

  async login(input: LoginDto): Promise<{
    accessToken: string;
    username: string;
  }> {
    const url = this.providerUrl('/auth/login_UP');
    const { data } = await AppApi.post<ProviderResponse<LoginUpResult>>(url, {
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

    if (
      typeof accessToken !== 'string' ||
      !accessToken.trim() ||
      typeof username !== 'string' ||
      !username.trim()
    ) {
      throw new BadGatewayException();
    }

    return { accessToken, username };
  }

  private async postToProvider<TResult = unknown>(
    url: string,
    body: Record<string, string>,
  ): Promise<ProviderResponse<TResult>> {
    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new ServiceUnavailableException();
    }

    const { data } = await AppApi.post<ProviderResponse<TResult>>(url, body);

    if (data?.success === false) throw new ProviderError(data);
    if (data?.success !== true) throw new BadGatewayException();

    return data;
  }

  private async deleteProviderUser(username: string): Promise<boolean> {
    try {
      await this.postToProvider(this.providerUrl('/user/deleteUser'), {
        systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
        systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
        username,
      });
      return true;
    } catch {
      this.logger.error(
        'Provider signup compensation failed; external user cleanup is required',
      );
      return false;
    }
  }

  private providerUrl(path: string): string {
    const baseUrl = this.config.getOrThrow<string>('AUTH_BASE_URL');
    return `${baseUrl.replace(/\/+$/, '')}${path}`;
  }
}
