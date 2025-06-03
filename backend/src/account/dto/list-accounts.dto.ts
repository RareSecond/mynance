import { Expose } from 'class-transformer';

export class ListAccountsResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  iban: string;
}
