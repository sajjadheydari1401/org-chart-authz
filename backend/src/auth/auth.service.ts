import {
  BadGatewayException,
  BadRequestException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SignupDto } from './dto/signup.dto.js';
import {
  AuthResponse,
  AuthErrorResult,
  SignupSuccessResult,
  ConfirmSmsSuccessResult,
} from '../types/auth.js';
import { ConfirmSMSDto } from './dto/confirm-sms.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  async signup(input: SignupDto): Promise<{ success: true }> {
    const url = this.config.getOrThrow<string>('AUTH_SIGNUP_URL');

    const settings = {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
      roleName: this.config.getOrThrow<string>('AUTH_ROLE_NAME'),
      smsTemplate: this.config.getOrThrow<string>('AUTH_SMS_TEMPLATE'),
      patternName: this.config.getOrThrow<string>('AUTH_PATTERN_NAME'),
      smsSystemName: this.config.getOrThrow<string>('AUTH_SMS_SYSTEM_NAME'),
    };

    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new ServiceUnavailableException();
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          email: input.email,
          username: input.username,
          password: input.password,
          mobile_number: input.mobile,
        }),
        signal: AbortSignal.timeout(15_000),
        redirect: 'error',
      });

      console.log('Signup res:', response);

      if (response.status === 401) {
        throw new ServiceUnavailableException();
      }

      if (!response.ok) {
        throw new BadGatewayException();
      }

      const data: AuthResponse<SignupSuccessResult | AuthErrorResult> =
        await response.json();

      if (!data.success) {
        throw new BadRequestException();
      }

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Signup error', error);

        throw error;
      }

      if (
        error instanceof Error &&
        ['TimeoutError', 'AbortError'].includes(error.name)
      ) {
        throw new GatewayTimeoutException();
      }

      throw new BadGatewayException();
    }
  }

  async confirmSms(input: ConfirmSMSDto): Promise<{ success: true }> {
    const url = this.config.getOrThrow<string>('AUTH_SIGNUP_URL');

    const settings = {
      systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
      systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
    };

    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new ServiceUnavailableException();
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          username: input.username,
          code: input.code,
        }),
        signal: AbortSignal.timeout(15_000),
        redirect: 'error',
      });

      console.log('confirm sms res:', response);

      if (response.status === 401) {
        throw new ServiceUnavailableException();
      }

      if (!response.ok) {
        throw new BadGatewayException();
      }

      const data: AuthResponse<ConfirmSmsSuccessResult | AuthErrorResult> =
        await response.json();

      if (!data.success) {
        throw new BadRequestException();
      }

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Confirm sms error', error);

        throw error;
      }

      if (
        error instanceof Error &&
        ['TimeoutError', 'AbortError'].includes(error.name)
      ) {
        throw new GatewayTimeoutException();
      }

      throw new BadGatewayException();
    }
  }
}
