import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { AuthProviderModule } from './auth-provider.module.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { RolesModule } from '../authorization/roles/roles.module.js';
import { JwtStrategy } from '../../../common/jwt_strategy/jwt.sterategy.js';

@Module({
  imports: [
    AuthProviderModule,
    UsersModule,
    RolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        const expiresIn = Number(config.getOrThrow<string>('JWT_EXPIRES_IN'));

        if (secret.length < 32) {
          throw new Error('JWT_SECRET must contain at least 32 characters');
        }
        if (!Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
          throw new Error(
            'JWT_EXPIRES_IN must be a positive number of seconds',
          );
        }

        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
