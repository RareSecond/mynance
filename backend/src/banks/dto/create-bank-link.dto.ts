import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBankLinkDto {
  @IsString()
  @IsNotEmpty()
  bankId: string;
}

export class BankLinkResponseDto {
  @IsString()
  @IsNotEmpty()
  link: string;
}
