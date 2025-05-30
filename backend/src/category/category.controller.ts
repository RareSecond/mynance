import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.create(createCategoryDto.category);
  }
}
