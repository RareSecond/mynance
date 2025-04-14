import { Module } from '@nestjs/common';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { GoCardlessService } from '../common/services/gocardless.service';
import { RequisitionModule } from '@/requisition/requisition.module';

@Module({
  controllers: [BanksController],
  providers: [BanksService, GoCardlessService],
  imports: [RequisitionModule],
})
export class BanksModule {}
