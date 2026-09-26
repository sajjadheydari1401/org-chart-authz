import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      /*AuthHeaderAsBearerToken تنظیم استخراج توکن از*/
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      /* jwt کلید امضای  */
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),

      /*زمان انقضای توکن*/
      expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN'),
    } as any);
  }

  /*تابع تایید توکن و استخراج اطلاعات درون توکن(وجود الزامی) */
  async validate(payload: any) {
    return {
      username: payload.sub,
    };
  }
}
