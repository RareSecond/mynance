import { ApiProperty } from '@nestjs/swagger';

export class AccountUserDto {
  id: string;
  @ApiProperty({
    format: 'email',
  })
  email: string;
}

export class GetAccountResponseDto {
  iban: string;
  name: string;
  users: AccountUserDto[];
}
