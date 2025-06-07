import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';

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

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }
}
