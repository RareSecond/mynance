import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async getUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string) {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async createUser(email: string) {
    return this.db.user.create({
      data: { email },
    });
  }
}
