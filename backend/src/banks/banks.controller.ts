import { Controller, Get } from '@nestjs/common';
import { BanksService } from './banks.service';
import { GetBanksResponse } from '@mynance/types';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  async getBanks(): Promise<GetBanksResponse[]> {
    return this.banksService.getBanks();
  }
}
