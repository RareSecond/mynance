import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountsDto {
  externalRequisitionId: string;
  @ApiProperty({
    minItems: 1,
  })
  accounts: string[];
}
