import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isValid = await super.canActivate(context);
    if (!isValid) {
      return false;
    }

    return true;
  }
}
