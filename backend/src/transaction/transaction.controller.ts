import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ImportTransactionsDto } from './dto/import-transactions.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { LinkCategoryDto } from './dto/link-category.dto';
import {
  GetAnalyticsQueryDto,
  AnalyticsCategoryDto,
} from './dto/get-analytics.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async listTransactions(
    @Query('uncategorizedOnly') uncategorizedOnly = false,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.listTransactions(uncategorizedOnly);
  }

  @Get('analytics')
  async getAnalytics(
    @Query() query: GetAnalyticsQueryDto,
  ): Promise<AnalyticsCategoryDto[]> {
    return this.transactionService.getAnalytics(
      query.type,
      new Date(query.startDate),
    );
  }

  @Post('import')
  async importTransactions(@Body() importDto: ImportTransactionsDto) {
    return this.transactionService.importTransactions(importDto.accountId);
  }

  @Post(':transactionId/category')
  async linkCategory(
    @Param('transactionId') transactionId: string,
    @Body() linkCategoryDto: LinkCategoryDto,
  ) {
    return this.transactionService.linkCategory(
      transactionId,
      linkCategoryDto.categoryId,
    );
  }
}
