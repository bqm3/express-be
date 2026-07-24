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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, ClientIp } from '../../common/decorators';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @SkipThrottle()
  @ApiOperation({ summary: 'Public post list (published only)' })
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query, false);
  }

  @Get('slug/:slug')
  @SkipThrottle()
  @ApiOperation({ summary: 'Post detail by slug (+ view count)' })
  findBySlug(@Param('slug') slug: string, @ClientIp() ip: string) {
    return this.postsService.findBySlug(slug, ip);
  }

  @Get('slug/:slug/related')
  @SkipThrottle()
  findRelated(@Param('slug') slug: string) {
    return this.postsService.findRelated(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.postsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.postsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.restore(id);
  }
}
