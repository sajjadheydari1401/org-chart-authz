import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';
import { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';
import { AuthProviderService } from './auth-provider.service.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authProvider: AuthProviderService,
    private readonly usersService: UsersService,
  ) {}

  async registerWithUsernamePassword(
    input: RegisterWithUsernamePasswordDto,
  ): Promise<{ success: true }> {
    await this.authProvider.registerWithTwoFactorUsernamePassword(input);

    try {
      await this.usersService.createLocalUser(input.username);
      return { success: true };
    } catch (error) {
      try {
        await this.authProvider.deleteUser(input.username);
      } catch {
        throw new ServiceUnavailableException();
      }

      throw error;
    }
  }

  async confirmRegistrationBySms(
    input: ConfirmRegistrationBySmsDto,
  ): Promise<{ success: true }> {
    await this.authProvider.confirmRegistrationBySms(input);

    return { success: true };
  }

  async loginWithUsernamePassword(
    input: LoginWithUsernamePasswordDto,
  ): Promise<{ accessToken: string; username: string }> {
    return this.authProvider.loginWithUsernamePassword(input);
  }
}
