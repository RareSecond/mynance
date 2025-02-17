import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(private testingService: TestingService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.testingService.getHello();
  }
}
