import { Injectable } from '@nestjs/common';
import { GoCardlessService } from '../common/services/gocardless.service';
import { GetBanksResponse } from '@mynance/types';
import { RequisitionService } from '@/requisition/requisition.service';

@Injectable()
export class BanksService {
  constructor(
    private readonly goCardlessService: GoCardlessService,
    private readonly requisitionService: RequisitionService,
  ) {}

  async getBanks(): Promise<GetBanksResponse[]> {
    return this.goCardlessService.listBanks();
  }

  async createLink(bankId: string) {
    const agreement =
      await this.goCardlessService.createEndUserAgreement(bankId);

    const { link, id } = await this.goCardlessService.createLink(
      bankId,
      agreement.id,
    );

    await this.requisitionService.createRequisition(id);

    return link;
  }
}
