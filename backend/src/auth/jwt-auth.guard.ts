import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private currentUserService: CurrentUserService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isValid = await super.canActivate(context);
    if (!isValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Set the user in the CurrentUserService
    this.currentUserService.setUser(user);

    return true;
  }
}
