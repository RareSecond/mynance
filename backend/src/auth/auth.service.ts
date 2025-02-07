import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getLoggedInUser(req: Request) {
    const userCookie = req['cookies']?.user;
    if (!userCookie) {
      return null;
    }
    return JSON.parse(userCookie);
  }
}
