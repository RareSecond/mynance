import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { LinkCategoryDto } from './dto/link-category.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { ImportTransactionsDto } from './dto/import-transactions.dto';
import {
  GetAnalyticsQueryDto,
  AnalyticsCategoryDto,
} from './dto/get-analytics.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'List transactions' })
  async listTransactions(
    @Query() query: ListTransactionsQueryDto,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.listTransactions(query.uncategorizedOnly);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get transaction analytics' })
  async getAnalytics(
    @Query() query: GetAnalyticsQueryDto,
  ): Promise<AnalyticsCategoryDto[]> {
    return this.transactionService.getAnalytics(
      query.type,
      new Date(query.startDate),
    );
  }

  @Post('import')
  @ApiOperation({ summary: 'Import transactions' })
  async importTransactions(@Body() importDto: ImportTransactionsDto) {
    return this.transactionService.importTransactions(importDto.accountId);
  }

  @Post(':transactionId/category')
  @ApiOperation({ summary: 'Link a category to a transaction' })
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
