import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CurrentUserService } from './current-user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuthRedirect(@Req() req: Request) {
    const user = req['user'] as { email: string };
    const res = req['res'];

    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      await this.userService.createUser(user.email);
    }

    // Generate a JWT token instead of storing raw user data
    const token = await this.authService.generateToken(user);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? 'codictive.be' : 'localhost',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const state = req['query']?.state || '/';
    res.redirect(state);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    req['res'].clearCookie('auth_token', {
      domain:
        process.env.NODE_ENV === 'production' ? 'codictive.be' : 'localhost',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser() {
    return this.currentUserService.getUser();
  }
}
