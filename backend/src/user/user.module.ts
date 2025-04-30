import { Module } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [DatabaseService, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
