import { CurrentUserService } from '@/auth/current-user.service';
import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequisitionService {
  constructor(
    private readonly database: DatabaseService,
    private readonly currentUser: CurrentUserService,
  ) {}

  async createRequisition(externalId: string) {
    const user = this.currentUser.getUser();

    const requisition = await this.database.requisition.create({
      data: { userId: user.id, externalId },
    });

    return requisition;
  }
}
