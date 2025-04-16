import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [AuthModule, DatabaseModule],
})
export class CategoryModule {}
