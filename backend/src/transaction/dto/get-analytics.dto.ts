export enum AnalyticsType {
  EXPENSES = 'expenses',
  INCOME = 'income',
  COMBINED = 'combined',
}

export class GetAnalyticsQueryDto {
  type: AnalyticsType;
  startDate: string;
}

export class AnalyticsCategoryDto {
  name: string;
  value: number;
}
