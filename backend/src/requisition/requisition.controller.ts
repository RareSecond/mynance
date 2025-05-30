import { Controller, Get, Param } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { AccountResponseDto } from './dto/get-accounts-response.dto';

@Controller('requisition')
export class RequisitionController {
  constructor(private readonly requisitionService: RequisitionService) {}

  @Get(':externalRequisitionId/accounts')
  async getAccounts(
    @Param('externalRequisitionId') externalRequisitionId: string,
  ): Promise<AccountResponseDto[]> {
    return this.requisitionService.getAccounts(externalRequisitionId);
  }
}
