import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { GoCardlessService } from '@/common/services/gocardless.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  providers: [AccountService, GoCardlessService],
  controllers: [AccountController],
  imports: [DatabaseModule, AuthModule],
})
export class AccountModule {}
