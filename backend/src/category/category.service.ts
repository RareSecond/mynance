import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { CurrentUserService } from '@/auth/current-user.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async findAll() {
    const user = this.currentUserService.getUser();

    return this.databaseService.category.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    });
  }

  async create(category: string) {
    const user = this.currentUserService.getUser();

    return this.databaseService.category.create({
      data: {
        name: category,
        userId: user.id,
      },
    });
  }
}
