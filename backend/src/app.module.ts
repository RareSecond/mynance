import { Module, Scope } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BanksModule } from './banks/banks.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    DatabaseModule,
    BanksModule,
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
