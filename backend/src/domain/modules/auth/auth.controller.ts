import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';
import { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';

@ApiTags('Authentication')
@UseInterceptors(FormatResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/username-password')
  @ApiOperation({
    summary: 'Register with username and password',
    description:
      'Creates a provider account with the selected local role and starts SMS verification.',
  })
  registerWithUsernamePassword(@Body() input: RegisterWithUsernamePasswordDto) {
    return this.authService.registerWithUsernamePassword(input);
  }

  @Post('register/confirm-sms')
  @ApiOperation({
    summary: 'Confirm registration by SMS',
    description: 'Confirms a new account using the SMS verification code.',
  })
  confirmRegistrationBySms(@Body() input: ConfirmRegistrationBySmsDto) {
    return this.authService.confirmRegistrationBySms(input);
  }

  @Post('login/username-password')
  @ApiOperation({
    summary: 'Log in with username and password',
    description: 'Validates credentials and returns an access token.',
  })
  loginWithUsernamePassword(@Body() input: LoginWithUsernamePasswordDto) {
    return this.authService.loginWithUsernamePassword(input);
  }
}
