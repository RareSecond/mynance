export class CreateCategoryDto {
  category: string;
}

export class CategoryDto {
  id: string;
  name: string;
  enabled: boolean;
}

export class UpdateCategoryDto {
  enabled?: boolean;
}
