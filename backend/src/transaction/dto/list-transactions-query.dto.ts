import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class ListTransactionsQueryDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  uncategorizedOnly?: boolean = false;
}
