import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class ListAccountsResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  externalId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  iban: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
