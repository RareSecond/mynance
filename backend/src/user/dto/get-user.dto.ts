import { ApiProperty } from '@nestjs/swagger';

export class GetUserQueryDto {
  @ApiProperty({
    format: 'email',
  })
  email: string;
}

export class UserResponseDto {
  id: string;
  @ApiProperty({
    format: 'email',
  })
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
