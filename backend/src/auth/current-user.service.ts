import { Injectable, Scope } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  private user: User | null = null;

  setUser(user: User) {
    this.user = user;
  }

  getUser(): User {
    if (!this.user) {
      throw new Error('User not found in current context');
    }
    return this.user;
  }
}
