export class CategoryAmountDto {
  categoryId: string;
  amount: number;
}

export class UpdateTransactionDto {
  note?: string;
  categories?: CategoryAmountDto[];
}
