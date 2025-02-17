import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TestingService } from './testing.service';

@Module({
  controllers: [TestingController],
  imports: [AuthModule],
  providers: [TestingService],
})
export class TestingModule {}
