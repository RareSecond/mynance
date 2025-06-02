import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountsDto {
  externalRequisitionId: string;
  @ApiProperty({
    minItems: 1,
  })
  accounts: string[];
}

export class AccountResponseDto {
  id: string;
  created: string;
  last_accessed: string;
  iban: string;
  bban: string;
  status: string;
  institution_id: string;
  owner_name: string;
  name: string;
}
