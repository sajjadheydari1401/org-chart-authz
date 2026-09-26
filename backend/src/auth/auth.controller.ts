import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { ConfirmSMSDto } from './dto/confirm-sms.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() input: SignupDto) {
    return this.authService.signup(input);
  }

  @Post('confirm-sms')
  confirmSms(@Body() input: ConfirmSMSDto) {
    return this.authService.confirmSms(input);
  }
}
