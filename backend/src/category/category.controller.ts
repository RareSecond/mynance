import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  async createCategory(@Body('category') category: string) {
    return this.categoryService.create(category);
  }
}
