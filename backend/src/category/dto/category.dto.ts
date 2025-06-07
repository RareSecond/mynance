import { Transform } from 'class-transformer';

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

export class FindCategoriesQueryDto {
  @Transform(({ value }) => value === 'true')
  enabled?: boolean;
}
