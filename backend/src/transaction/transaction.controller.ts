import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post(':transactionId/category')
  async linkCategory(
    @Param('transactionId') transactionId: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.transactionService.linkCategory(transactionId, categoryId);
  }
}
