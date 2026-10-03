import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { headers?: { cookie?: string } } | undefined) => {
          const rawCookie = request?.headers?.cookie;
          if (!rawCookie) return null;

          const match = rawCookie
            .split(';')
            .map((part: string) => part.trim())
            .find((part: string) => part.startsWith('access_token='));

          if (!match) return null;

          return decodeURIComponent(match.split('=')[1] ?? '');
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
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
