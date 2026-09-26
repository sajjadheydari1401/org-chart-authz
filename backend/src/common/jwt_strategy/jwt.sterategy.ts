import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      /*AuthHeaderAsBearerToken تنظیم استخراج توکن از*/
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      /* jwt کلید امضای  */
      secretOrKey: process.env.JWT_SECRET as string,

      /*زمان انقضای توکن*/
      expiresIn: process.env.JWT_EXPIRES_IN,
    } as any);
  }

  /*تابع تایید توکن و استخراج اطلاعات درون توکن(وجود الزامی) */
  async validate(payload: any) {
    return {
      username: payload.sub,
    };
  }
}
