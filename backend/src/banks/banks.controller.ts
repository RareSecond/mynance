import { Controller, Get, Post, Body } from '@nestjs/common';
import { BanksService } from './banks.service';
import { GetBanksResponseDto } from './dto/get-banks-response.dto';
import {
  CreateBankLinkDto,
  BankLinkResponseDto,
} from './dto/create-bank-link.dto';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  async getBanks(): Promise<GetBanksResponseDto[]> {
    return this.banksService.getBanks();
  }

  @Post('link')
  async createLink(
    @Body() createBankLinkDto: CreateBankLinkDto,
  ): Promise<BankLinkResponseDto> {
    const link = await this.banksService.createLink(createBankLinkDto.bankId);
    return { link };
  }
}
