import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export enum AnalyticsType {
  EXPENSES = 'expenses',
  INCOME = 'income',
  COMBINED = 'combined',
}

export class GetAnalyticsQueryDto {
  @IsEnum(AnalyticsType)
  type: AnalyticsType;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;
}

export class AnalyticsCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: number;
}
