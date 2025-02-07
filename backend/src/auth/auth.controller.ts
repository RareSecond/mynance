import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    // Access the authenticated user from the request object
    const user = req['user'];
    // Set cookie with user info
    const res = req['res'];
    res.cookie('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? 'codictive.be' : 'localhost',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Redirect back to frontend
    const state = req['query']?.state;
    res.redirect(state);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    req['res'].clearCookie('user', {
      domain:
        process.env.NODE_ENV === 'production' ? 'codictive.be' : 'localhost',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
    return { message: 'Logged out' };
  }

  @Get('user')
  getUser(@Req() req: Request) {
    return this.authService.getLoggedInUser(req);
  }
}
