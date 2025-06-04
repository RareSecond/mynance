import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AccountService } from './account.service';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { LinkUserDto } from './dto/link-user.dto';
import { GetAccountResponseDto } from './dto/get-account.dto';
import { ListAccountsResponseDto } from './dto/list-accounts.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async listAccounts(): Promise<ListAccountsResponseDto[]> {
    const accounts = await this.accountService.listAccounts();
    return plainToInstance(ListAccountsResponseDto, accounts, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':accountId')
  async getAccount(
    @Param('accountId') accountId: string,
  ): Promise<GetAccountResponseDto> {
    const account = await this.accountService.getAccount(accountId);
    return plainToInstance(GetAccountResponseDto, account, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @HttpCode(201)
  async createAccounts(
    @Body() createAccountsDto: CreateAccountsDto,
  ): Promise<void> {
    await this.accountService.createAccounts(
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
