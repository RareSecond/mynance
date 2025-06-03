import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AccountUserDto {
  @Expose()
  id: string;
  @Expose()
  @ApiProperty({
    format: 'email',
  })
  email: string;
}

export class GetAccountResponseDto {
  @Expose()
  iban: string;
  @Expose()
  name: string;
  @Expose()
  @Type(() => AccountUserDto)
  users: AccountUserDto[];
}
