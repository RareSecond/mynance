import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async listAccounts() {
    return this.accountService.listAccounts();
  }

  @Post()
  async createAccounts(
    @Body('externalRequisitionId') externalRequisitionId: string,
    @Body('accounts') accounts: string[],
  ) {
    return this.accountService.createAccounts(externalRequisitionId, accounts);
  }
}
