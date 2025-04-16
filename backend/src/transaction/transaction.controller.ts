import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async listTransactions() {
    return this.transactionService.listTransactions();
  }

  @Post('import')
  async importTransactions(@Body('accountId') accountId: string) {
    return this.transactionService.importTransactions(accountId);
  }
}
