export class CategoryDto {
  id: string;
  name: string;
}

export class TransactionCategoryDto {
  category: CategoryDto;
}

export class TransactionResponseDto {
  id: string;
  amount: number;
  currency: string;
  description: string;
  counterPartyName: string;
  createdAt: Date;
  note?: string;
  categories: TransactionCategoryDto[];
}
