import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class GetBanksResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bic: string;

  @IsString()
  @IsUrl()
  logo: string;
}
