import { Injectable, BadRequestException } from '@nestjs/common';
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

  async listAccounts(externalRequisitionId: string) {
    return this.goCardlessService.listAccounts(externalRequisitionId);
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
            user: {
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
}
