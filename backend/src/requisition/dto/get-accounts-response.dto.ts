import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class AccountResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDateString()
  created: string;

  @IsDateString()
  last_accessed: string;

  @IsString()
  @IsNotEmpty()
  iban: string;

  @IsString()
  @IsNotEmpty()
  bban: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  institution_id: string;

  @IsString()
  @IsNotEmpty()
  owner_name: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
