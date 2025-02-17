import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserService } from './current-user.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private currentUserService: CurrentUserService,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isValid = await super.canActivate(context);
    if (!isValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      return false;
    }

    const user = await this.userService.getUserById(request.user.id);

    if (!user) {
      return false;
    }

    // Set the user in the CurrentUserService
    this.currentUserService.setUser(user);

    return true;
  }
}
