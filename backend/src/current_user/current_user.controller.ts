import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUserService } from './current_user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('current-user')
export class CurrentUserController {
  constructor(private readonly currentUserService: CurrentUserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser() {
    return this.currentUserService.getUser();
  }
}
