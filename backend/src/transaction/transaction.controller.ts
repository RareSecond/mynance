import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ImportTransactionsDto } from './dto/import-transactions.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async listTransactions(
    @Query('uncategorizedOnly') uncategorizedOnly?: string,
  ) {
    return this.transactionService.listTransactions(
      uncategorizedOnly === 'true',
    );
  }

  @Get('analytics')
  async getAnalytics(
    @Query('type') type: 'expenses' | 'income' | 'combined',
    @Query('startDate') startDate: string,
  ) {
    return this.transactionService.getAnalytics(type, new Date(startDate));
  }

  @Post('import')
  async importTransactions(@Body() importDto: ImportTransactionsDto) {
    return this.transactionService.importTransactions(importDto.accountId);
  }

  @Post(':transactionId/category')
  async linkCategory(
    @Param('transactionId') transactionId: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.transactionService.linkCategory(transactionId, categoryId);
  }
}
