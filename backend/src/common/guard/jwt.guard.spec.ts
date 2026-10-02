import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { beforeEach, vi } from 'vitest';
import { Public } from '../decorator/public.decorator.js';
import { RequireAccess } from '../decorator/require-access.decorator.js';
import { AccessGuard } from './authorization.guard.js';
import { JwtAuthGuard } from './jwt.guard.js';
import { JwtStrategy } from '../jwt_strategy/jwt.sterategy.js';
import { EffectiveAccessService } from '../../domain/modules/authorization/effective-access.service.js';

const jwtSecret = 'test-jwt-secret-that-is-long-enough';
const requiredGrant = { route: '/guard-test/protected', methodName: 'GET' };
const effectiveAccessService = {
  getEffectiveAccessesForUsername: vi.fn(),
};

@Controller('guard-test')
class GuardTestController {
  @Public()
  @Get('public')
  getPublic() {
    return { access: 'public' };
  }

  @Get('protected')
  @RequireAccess(requiredGrant)
  getProtected() {
    return { access: 'protected' };
  }

  @Get('missing-permission')
  getMissingPermission() {
    return { access: 'should-not-be-reached' };
  }
}

describe('JwtAuthGuard', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(() => {
    effectiveAccessService.getEffectiveAccessesForUsername.mockReset();
    effectiveAccessService.getEffectiveAccessesForUsername.mockResolvedValue([
      requiredGrant,
    ]);
  });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret: jwtSecret }),
      ],
      controllers: [GuardTestController],
      providers: [
        {
          provide: ConfigService,
          useValue: { getOrThrow: () => jwtSecret },
        },
        {
          provide: EffectiveAccessService,
          useValue: effectiveAccessService,
        },
        JwtStrategy,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: AccessGuard },
      ],
    }).compile();

    app = module.createNestApplication();
    jwtService = module.get(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows explicitly public routes without a token', async () => {
    await request(app.getHttpServer())
      .get('/guard-test/public')
      .expect(200)
      .expect({ access: 'public' });
    expect(
      effectiveAccessService.getEffectiveAccessesForUsername,
    ).not.toHaveBeenCalled();
  });

  it('rejects protected routes without a token', async () => {
    await request(app.getHttpServer()).get('/guard-test/protected').expect(401);
  });

  it('allows protected routes with a valid app token', async () => {
    const token = await jwtService.signAsync({ sub: 'person' });

    await request(app.getHttpServer())
      .get('/guard-test/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ access: 'protected' });
  });

  it('denies authenticated routes when the required grant is missing', async () => {
    effectiveAccessService.getEffectiveAccessesForUsername.mockResolvedValue(
      [],
    );
    const token = await jwtService.signAsync({ sub: 'person' });

    await request(app.getHttpServer())
      .get('/guard-test/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('fails closed when a protected route has no permission metadata', async () => {
    const token = await jwtService.signAsync({ sub: 'person' });

    await request(app.getHttpServer())
      .get('/guard-test/missing-permission')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
