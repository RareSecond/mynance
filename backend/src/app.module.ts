import { Module, Scope } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BanksModule } from './banks/banks.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { RequisitionModule } from './requisition/requisition.module';
import { CategoryModule } from './category/category.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    DatabaseModule,
    BanksModule,
    AccountModule,
    TransactionModule,
    RequisitionModule,
    CategoryModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      scope: Scope.REQUEST,
    },
  ],
})
export class AppModule {}
