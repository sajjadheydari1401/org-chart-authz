import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

      // This is the app's signing key, not a provider JWT secret.
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub?: unknown }) {
    if (typeof payload.sub !== 'string' || !payload.sub.trim()) {
      throw new UnauthorizedException();
    }

    return {
      username: payload.sub,
    };
  }
}
