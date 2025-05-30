import { IsString, IsNotEmpty, IsEmail, IsArray } from 'class-validator';

export class AccountUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class GetAccountResponseDto {
  @IsString()
  @IsNotEmpty()
  iban: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  users: AccountUserDto[];
}
