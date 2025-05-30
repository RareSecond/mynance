import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class ListTransactionsQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  uncategorizedOnly?: boolean;
}
