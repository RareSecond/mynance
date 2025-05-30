import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountsDto,
  AccountResponseDto,
} from './dto/create-accounts.dto';
import { LinkUserDto } from './dto/link-user.dto';
import { GetAccountResponseDto } from './dto/get-account.dto';
import { ListAccountsResponseDto } from './dto/list-accounts.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async listAccounts(): Promise<ListAccountsResponseDto[]> {
    return this.accountService.listAccounts();
  }

  @Get(':accountId')
  async getAccount(
    @Param('accountId') accountId: string,
  ): Promise<GetAccountResponseDto> {
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
    @Body() linkUserDto: LinkUserDto,
  ): Promise<void> {
    return this.accountService.linkUserToAccount(accountId, linkUserDto.userId);
  }
}
