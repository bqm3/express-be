import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { CategoriesService } from './categories.service';
import {
  CategoryQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @SkipThrottle()
  @ApiOperation({
    summary:
      'List categories; withPostCount=true → admin: category cha phân trang kèm children/postCount',
  })
  findAll(@Query() query: CategoryQueryDto) {
    if (query.withPostCount) {
      return this.categoriesService.findAllWithPostCount(query);
    }
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @SkipThrottle()
  @ApiOperation({ summary: 'Category tree for menus' })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get('menu')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Menu header: category cha + category con (showInHeaderMenu)',
  })
  getMenu() {
    return this.categoriesService.getMenu();
  }

  @Get('sidebar')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Sidebar: categories (showInSidebar) + posts (Redis cache)',
  })
  getSidebar() {
    return this.categoriesService.getSidebar();
  }

  @Get('resolve/:slug')
  @SkipThrottle()
  @ApiOperation({
    summary:
      'Resolve public slug → category_list | single_post (404 nếu không có)',
  })
  resolveSlug(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.categoriesService.resolveSlug(slug, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });
  }

  @Get('slug/:slug')
  @SkipThrottle()
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
