import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LoginUpResult } from '../../../common/types/login-up-result.js';
import type { TwoFARegisterUpResult } from '../../../common/types/two-fa-register-up-result.js';
import { postToProvider } from '../../../common/utils/api/post-to-provider.js';
import {
  providerUrl,
  systemCredentials,
} from '../../../common/utils/api/provider-config.js';
import type { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import type { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';
import { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';

@Injectable()
export class AuthProviderService {
  constructor(private readonly config: ConfigService) {}

  async registerWithTwoFactorUsernamePassword(
    input: RegisterWithUsernamePasswordDto,
  ): Promise<void> {
    await postToProvider<TwoFARegisterUpResult>(
      providerUrl(this.config, '/auth/2FA_register_UP'),
      {
        ...systemCredentials(this.config),
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
    await postToProvider(providerUrl(this.config, '/auth/register/confirm'), {
      ...systemCredentials(this.config),
      username: input.username,
      code: input.code,
    });
  }

  async loginWithUsernamePassword(
    input: LoginWithUsernamePasswordDto,
  ): Promise<{ accessToken: string; username: string }> {
    const data = await postToProvider<LoginUpResult>(
      providerUrl(this.config, '/auth/login_UP'),
      {
        ...systemCredentials(this.config),
        roleName: this.config.getOrThrow<string>('AUTH_ROLE_NAME'),
        username: input.username,
        password: input.password,
      },
    );

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
    await postToProvider(providerUrl(this.config, '/user/deleteUser'), {
      ...systemCredentials(this.config),
      username,
    });
  }
}
