import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { Public } from '../decorator/public.decorator.js';
import { JwtAuthGuard } from './jwt.guard.js';
import { JwtStrategy } from '../jwt_strategy/jwt.sterategy.js';

const jwtSecret = 'test-jwt-secret-that-is-long-enough';

@Controller('guard-test')
class GuardTestController {
  @Public()
  @Get('public')
  getPublic() {
    return { access: 'public' };
  }

  @Get('protected')
  getProtected() {
    return { access: 'protected' };
  }
}

describe('JwtAuthGuard', () => {
  let app: INestApplication;
  let jwtService: JwtService;

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
        JwtStrategy,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
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
});
