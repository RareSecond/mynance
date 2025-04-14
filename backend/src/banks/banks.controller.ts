import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { BanksService } from './banks.service';
import { GetBanksResponse } from '@mynance/types';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  async getBanks(): Promise<GetBanksResponse[]> {
    return this.banksService.getBanks();
  }

  @Get('link')
  async createLink(@Query('bankId') bankId: string) {
    const link = await this.banksService.createLink(bankId);
    return link;
  }
}
