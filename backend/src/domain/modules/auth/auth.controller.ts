import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';
import { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';

@ApiTags('Auth')
@UseInterceptors(FormatResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/username-password')
  registerWithUsernamePassword(@Body() input: RegisterWithUsernamePasswordDto) {
    return this.authService.registerWithUsernamePassword(input);
  }

  @Post('register/confirm-sms')
  confirmRegistrationBySms(@Body() input: ConfirmRegistrationBySmsDto) {
    return this.authService.confirmRegistrationBySms(input);
  }

  @Post('login/username-password')
  loginWithUsernamePassword(@Body() input: LoginWithUsernamePasswordDto) {
    return this.authService.loginWithUsernamePassword(input);
  }
}
