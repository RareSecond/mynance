import { Controller, Get, Query } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async listAccounts(
    @Query('externalRequisitionId') externalRequisitionId: string,
  ) {
    return this.accountService.listAccounts(externalRequisitionId);
  }
}
