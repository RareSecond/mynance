import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiResponse } from '@nestjs/swagger';
import { Account } from './account.dto';
import {
  CreateAccountsDto,
  AccountResponseDto,
} from './dto/create-accounts.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of accounts',
    type: [Account],
  })
  async listAccounts() {
    return this.accountService.listAccounts();
  }

  @Get(':accountId')
  async getAccount(@Param('accountId') accountId: string) {
    return this.accountService.getAccount(accountId);
  }

  @Post()
  async createAccounts(
    @Body() createAccountsDto: CreateAccountsDto,
  ): Promise<AccountResponseDto[]> {
    return this.accountService.createAccounts(
      createAccountsDto.externalRequisitionId,
      createAccountsDto.accounts,
    );
  }

  @Post(':accountId/link-user')
  async linkUserToAccount(
    @Param('accountId') accountId: string,
    @Body('userId') userId: string,
  ) {
    return this.accountService.linkUserToAccount(accountId, userId);
  }
}
