import { Module } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  providers: [RequisitionService],
  exports: [RequisitionService],
  imports: [DatabaseModule, AuthModule],
})
export class RequisitionModule {}
