import { Transform } from 'class-transformer';

export class ListTransactionsQueryDto {
  @Transform(({ value }) => value === 'true')
  uncategorizedOnly?: boolean = false;
}
