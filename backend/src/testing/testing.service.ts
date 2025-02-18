import { Injectable } from '@nestjs/common';
import { CurrentUserService } from 'src/auth/current-user.service';

@Injectable()
export class TestingService {
  constructor(private currentUserService: CurrentUserService) {}

  getHello(): string {
    const user = this.currentUserService.getUser();
    return `Hello ${user.email}!`;
  }
}
