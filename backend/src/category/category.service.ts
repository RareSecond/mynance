import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { CurrentUserService } from '@/auth/current-user.service';
import { AccountService } from '@/account/account.service';
import { UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly currentUserService: CurrentUserService,
    private readonly accountService: AccountService,
  ) {}

  async findAll() {
    const user = this.currentUserService.getUser();

    return this.databaseService.category.findMany({
      where: {
        account: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(category: string) {
    const accounts = await this.accountService.listAccounts();

    return this.databaseService.category.create({
      data: {
        name: category,
        accountId: accounts[0].id,
      },
    });
  }

  async update(categoryId: string, updateDto: UpdateCategoryDto) {
    const user = this.currentUserService.getUser();

    // First verify the user has access to this category
    const category = await this.databaseService.category.findFirst({
      where: {
        id: categoryId,
        account: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return this.databaseService.category.update({
      where: { id: categoryId },
      data: updateDto,
    });
  }
}
