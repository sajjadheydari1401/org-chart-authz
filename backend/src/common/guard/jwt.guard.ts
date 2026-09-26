import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()

/*ایجاد یک گارد  برای حفاظت مسیرها 
JWT با استفاده از استراتژی احراز هویت */
export class JwtAuthGuard extends AuthGuard('jwt') {}
