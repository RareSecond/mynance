import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateToken(user: { email: string }) {
    const dbUser = await this.userService.getUserByEmail(user.email);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    try {
      const payload = { id: dbUser.id };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new UnauthorizedException('Failed to generate token');
    }
  }
}
