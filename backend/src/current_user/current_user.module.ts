import { forwardRef, Module } from '@nestjs/common';
import { CurrentUserService } from './current_user.service';
import { CurrentUserController } from './current_user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [CurrentUserService],
  controllers: [CurrentUserController],
  exports: [CurrentUserService],
})
export class CurrentUserModule {}
