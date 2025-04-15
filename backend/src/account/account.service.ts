import { Injectable } from '@nestjs/common';
import { GoCardlessService } from '@/common/services/gocardless.service';

@Injectable()
export class AccountService {
  constructor(private readonly goCardlessService: GoCardlessService) {}

  async listAccounts(externalRequisitionId: string) {
    return this.goCardlessService.listAccounts(externalRequisitionId);
  }
}
