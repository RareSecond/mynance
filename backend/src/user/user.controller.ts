import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserQueryDto, UserResponseDto } from './dto/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUser(@Query() query: GetUserQueryDto): Promise<UserResponseDto> {
    return this.userService.getUserByEmail(query.email);
  }
}
