import { Controller, Get } from '@nestjs/common';
import { BanksService } from './banks.service';
import { Institution } from '@/common/services/gocardless.service';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  async getBanks(): Promise<Institution[]> {
    return this.banksService.getBanks();
  }
}
