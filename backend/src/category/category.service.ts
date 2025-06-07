import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { CurrentUserService } from '@/auth/current-user.service';
import { AccountService } from '@/account/account.service';

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
}
