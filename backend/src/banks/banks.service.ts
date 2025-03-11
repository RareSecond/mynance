import { Injectable } from '@nestjs/common';
import {
  GoCardlessService,
  Institution,
} from '../common/services/gocardless.service';

@Injectable()
export class BanksService {
  constructor(private readonly goCardlessService: GoCardlessService) {}

  async getBanks(): Promise<Institution[]> {
    return this.goCardlessService.listBanks();
  }
}
