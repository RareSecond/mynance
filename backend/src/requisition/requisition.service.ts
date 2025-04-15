import { CurrentUserService } from '@/auth/current-user.service';
import { DatabaseService } from '@/database/database.service';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequisitionService {
  constructor(
    private readonly database: DatabaseService,
    private readonly currentUser: CurrentUserService,
    private readonly gocardlessService: GoCardlessService,
  ) {}

  async createRequisition(externalId: string) {
    const user = this.currentUser.getUser();

    const requisition = await this.database.requisition.create({
      data: { userId: user.id, externalId },
    });

    return requisition;
  }

  async getAccounts(externalRequisitionId: string) {
    const { accounts } = await this.gocardlessService.listAccounts(
      externalRequisitionId,
    );

    const accountsData = await Promise.all(
      accounts.map((account) => this.gocardlessService.getAccount(account)),
    );

    return accountsData;
  }
}
