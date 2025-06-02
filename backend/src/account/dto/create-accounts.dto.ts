export class CreateAccountsDto {
  externalRequisitionId: string;
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
