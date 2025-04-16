import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { DatabaseModule } from '@/database/database.module';
import { AccountModule } from '@/account/account.module';

@Module({
  providers: [TransactionService, GoCardlessService],
  controllers: [TransactionController],
  imports: [DatabaseModule, AccountModule],
})
export class TransactionModule {}
