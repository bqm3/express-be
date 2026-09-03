import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import {
  CreateMediaDto,
  CreateMediaTypeDto,
  MediaQueryDto,
  UpdateMediaDto,
  UpdateMediaTypeDto,
} from './dto/media.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('types')
  @ApiOperation({ summary: 'List media types (banner, general, ...)' })
  listTypes() {
    return this.mediaService.listTypes();
  }

  @Get('banners')
  @ApiOperation({ summary: 'Public: active banners' })
  getBanners() {
    return this.mediaService.getActiveBanners();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin list media' })
  @ApiQuery({ name: 'type', required: false, example: 'banner' })
  findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create media from public/external image URL' })
  create(
    @Body() dto: CreateMediaDto,
    @CurrentUser() user?: { id?: number },
  ) {
    return this.mediaService.createFromUrl(dto, user?.id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media file' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        type: {
          type: 'string',
          example: 'banner',
          description: 'media_types.code',
        },
        title: { type: 'string' },
        altText: { type: 'string' },
        linkUrl: { type: 'string' },
        sortOrder: { type: 'integer' },
        isActive: { type: 'boolean', default: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type?: string,
    @Body('title') title?: string,
    @Body('altText') altText?: string,
    @Body('linkUrl') linkUrl?: string,
    @Body('sortOrder') sortOrder?: string,
    @Body('isActive') isActive?: string,
    @CurrentUser() user?: { id?: number },
  ) {
    const active =
      isActive === undefined || isActive === ''
        ? true
        : !['false', '0', 'no'].includes(String(isActive).toLowerCase());

    return this.mediaService.upload(file, {
      typeCode: type || 'general',
      title,
      altText,
      linkUrl,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      isActive: active,
      createdBy: user?.id,
    });
  }

  @Post('types')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createType(@Body() dto: CreateMediaTypeDto) {
    return this.mediaService.createType(dto);
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaTypeDto,
  ) {
    return this.mediaService.updateType(id, dto);
  }

  @Delete('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete media type (blocked if still in use)' })
  removeType(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.removeType(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaDto,
  ) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.remove(id);
  }
}
