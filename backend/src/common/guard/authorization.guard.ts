import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class AccessGuard implements CanActivate {
  canActivate(): boolean {
    return false;
  }
}
