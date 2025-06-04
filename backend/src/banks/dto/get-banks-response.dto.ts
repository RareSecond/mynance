import { ApiProperty } from '@nestjs/swagger';

export class GetBanksResponseDto {
  id: string;
  name: string;
  bic: string;
  @ApiProperty({
    format: 'uri',
  })
  logo: string;
}
