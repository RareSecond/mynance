import { Controller, Get, Param } from '@nestjs/common';
import { RequisitionService } from './requisition.service';

@Controller('requisition')
export class RequisitionController {
  constructor(private readonly requisitionService: RequisitionService) {}

  @Get(':externalRequisitionId/accounts')
  async getAccounts(
    @Param('externalRequisitionId') externalRequisitionId: string,
  ) {
    return this.requisitionService.getAccounts(externalRequisitionId);
  }
}
