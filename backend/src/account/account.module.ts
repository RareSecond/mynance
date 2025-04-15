import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { GoCardlessService } from '@/common/services/gocardless.service';

@Module({
  providers: [AccountService, GoCardlessService],
  controllers: [AccountController],
})
export class AccountModule {}
