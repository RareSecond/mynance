import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserDto {
  id: string;
  @ApiProperty({
    format: 'email',
  })
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
