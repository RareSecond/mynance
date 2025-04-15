import { Module } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { RequisitionController } from './requisition.controller';
import { GoCardlessService } from '@/common/services/gocardless.service';

@Module({
  providers: [RequisitionService, GoCardlessService],
  exports: [RequisitionService],
  imports: [DatabaseModule, AuthModule],
  controllers: [RequisitionController],
})
export class RequisitionModule {}
