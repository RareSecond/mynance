import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { DatabaseService } from '@/database/database.service';
import { CurrentUserService } from '@/auth/current-user.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly goCardlessService: GoCardlessService,
    private readonly databaseService: DatabaseService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async listAccounts() {
    const user = this.currentUserService.getUser();

    return this.databaseService.account.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createAccounts(externalRequisitionId: string, accounts: string[]) {
    const user = this.currentUserService.getUser();

    const gocardlessRequisition = await this.goCardlessService.listAccounts(
      externalRequisitionId,
    );

    if (
      !gocardlessRequisition.accounts
        .sort()
        .every((account, index) => account === accounts.sort()[index])
    ) {
      throw new BadRequestException('Accounts do not match');
    }

    const gocardlessAccounts = await Promise.all(
      accounts.map((account) => this.goCardlessService.getAccount(account)),
    );

    await Promise.all(
      gocardlessAccounts.map((account) =>
        this.databaseService.account.create({
          data: {
            externalId: account.id,
            iban: account.iban,
            name: account.name,
            requisition: {
              connect: {
                externalId: externalRequisitionId,
              },
            },
            users: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
      ),
    );

    return gocardlessAccounts;
  }

  async getExternalAccountId(accountId: string) {
    const account = await this.databaseService.account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account.externalId;
  }

  async getAccount(accountId: string) {
    const account = await this.databaseService.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        iban: true,
        name: true,
        users: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async linkUserToAccount(accountId: string, userId: string) {
    await this.databaseService.account.update({
      where: {
        id: accountId,
      },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }
}
