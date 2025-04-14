import { Injectable } from '@nestjs/common';
import { GoCardlessService } from '../common/services/gocardless.service';
import { GetBanksResponse } from '@mynance/types';

@Injectable()
export class BanksService {
  constructor(private readonly goCardlessService: GoCardlessService) {}

  async getBanks(): Promise<GetBanksResponse[]> {
    return this.goCardlessService.listBanks();
  }
}
