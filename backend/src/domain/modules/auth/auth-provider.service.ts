import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError } from '../../../common/filter/provider-error.js';
import type { LoginUpResult } from '../../../common/types/login-up-result.js';
import type { ProviderResponse } from '../../../common/types/provider-response.js';
import type { TwoFARegisterUpResult } from '../../../common/types/two-fa-register-up-result.js';
import { AppApi } from '../../../common/utils/api/AppApi.js';
import type { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import type { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';
import { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';

@Injectable()
export class AuthProviderService {
  constructor(private readonly config: ConfigService) {}

  async registerWithTwoFactorUsernamePassword(
    input: RegisterWithUsernamePasswordDto,
  ): Promise<void> {
    await this.postToProvider<TwoFARegisterUpResult>(
      this.providerUrl('/auth/2FA_register_UP'),
      {
        ...this.systemCredentials(),
        roleName: this.config.getOrThrow<string>('AUTH_ROLE_NAME'),
        smsTemplate: this.config.getOrThrow<string>('AUTH_SMS_TEMPLATE'),
        patternName: this.config.getOrThrow<string>('AUTH_PATTERN_NAME'),
        smsSystemName: this.config.getOrThrow<string>('AUTH_SMS_SYSTEM_NAME'),
        email: input.email,
        username: input.username,
        password: input.password,
        mobile_number: input.mobile,
      },
    );
  }

  async confirmRegistrationBySms(
    input: ConfirmRegistrationBySmsDto,
  ): Promise<void> {
    await this.postToProvider(this.providerUrl('/auth/register/confirm'), {
      ...this.systemCredentials(),
      username: input.username,
      code: input.code,
    });
  }

  async loginWithUsernamePassword(
    input: LoginWithUsernamePasswordDto,
  ): Promise<{ accessToken: string; username: string }> {
    const { data } = await AppApi.post<ProviderResponse<LoginUpResult>>(
      this.providerUrl('/auth/login_UP'),
      {
        ...this.systemCredentials(),
        roleName: this.config.getOrThrow<string>('AUTH_ROLE_NAME'),
        username: input.username,
        password: input.password,
      },
    );

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

  async deleteUser(username: string): Promise<void> {
    await this.postToProvider(this.providerUrl('/user/deleteUser'), {
      ...this.systemCredentials(),
      username,
    });
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

  private systemCredentials(): Record<string, string> {
    return {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
    };
  }

  private providerUrl(path: string): string {
    const baseUrl = this.config.getOrThrow<string>('AUTH_BASE_URL');
    return `${baseUrl.replace(/\/+$/, '')}${path}`;
  }
}
