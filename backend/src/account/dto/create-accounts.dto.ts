import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';

export class CreateAccountsDto {
  @IsString()
  @IsNotEmpty()
  externalRequisitionId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  accounts: string[];
}

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
