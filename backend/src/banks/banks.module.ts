import { Module } from '@nestjs/common';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { GoCardlessService } from '../common/services/gocardless.service';

@Module({
  controllers: [BanksController],
  providers: [BanksService, GoCardlessService],
})
export class BanksModule {}
