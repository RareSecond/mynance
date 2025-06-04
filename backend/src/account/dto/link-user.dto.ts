import { ApiProperty } from '@nestjs/swagger';

export class LinkUserDto {
  @ApiProperty({
    format: 'uuid',
  })
  userId: string;
}
