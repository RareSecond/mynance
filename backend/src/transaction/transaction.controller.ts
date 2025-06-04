import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { ImportTransactionsDto } from './dto/import-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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

  @Patch(':transactionId')
  @ApiOperation({ summary: 'Update a transaction' })
  async updateTransaction(
    @Param('transactionId') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<void> {
    await this.transactionService.updateTransaction(
      transactionId,
      updateTransactionDto,
    );
  }
}
