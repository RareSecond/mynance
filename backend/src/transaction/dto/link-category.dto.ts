import { IsString, IsNotEmpty } from 'class-validator';

export class LinkCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
