import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Media } from './entities/media.entity';
import { MediaType } from './entities/media-type.entity';
import { UploadService } from '../upload/upload.service';
import {
  CreateMediaDto,
  CreateMediaTypeDto,
  MediaQueryDto,
  UpdateMediaDto,
  UpdateMediaTypeDto,
} from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media) private readonly mediaModel: typeof Media,
    @InjectModel(MediaType)
    private readonly mediaTypeModel: typeof MediaType,
    private readonly uploadService: UploadService,
  ) {}

  async listTypes() {
    return this.mediaTypeModel.findAll({
      where: { isDeleted: false },
      order: [['id', 'ASC']],
    });
  }

  async createType(dto: CreateMediaTypeDto) {
    const exists = await this.mediaTypeModel.findOne({
      where: { code: dto.code, isDeleted: false },
    });
    if (exists) {
      throw new BadRequestException(`Media type "${dto.code}" already exists`);
    }
    return this.mediaTypeModel.create({
      code: dto.code,
      name: dto.name,
      description: dto.description ?? null,
      isDeleted: false,
    });
  }

  async updateType(id: number, dto: UpdateMediaTypeDto) {
    const row = await this.mediaTypeModel.findOne({
      where: { id, isDeleted: false },
    });
    if (!row) throw new NotFoundException('Media type not found');
    await row.update(dto);
    return row;
  }

  async removeType(id: number) {
    const row = await this.mediaTypeModel.findOne({
      where: { id, isDeleted: false },
    });
    if (!row) throw new NotFoundException('Media type not found');

    const usedMedias = await this.mediaModel.findAll({
      where: { mediaTypeId: id, isDeleted: false },
      attributes: ['id', 'title'],
      order: [['id', 'DESC']],
      limit: 10,
    });
    const totalUsed = await this.mediaModel.count({
      where: { mediaTypeId: id, isDeleted: false },
    });

    if (totalUsed > 0) {
      const names = usedMedias
        .map((m) => m.title?.trim() || `#${m.id}`)
        .join(', ');
      const more =
        totalUsed > usedMedias.length
          ? ` và ${totalUsed - usedMedias.length} media khác`
          : '';
      throw new BadRequestException(
        `Không thể xóa type "${row.name}" vì đang có ${totalUsed} media sử dụng: ${names}${more}`,
      );
    }

    await row.update({ isDeleted: true });
    return { deleted: true };
  }

  async findAll(query: MediaQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = { isDeleted: false };
    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const include = [
      {
        model: MediaType,
        required: true,
        where: {
          isDeleted: false,
          ...(query.type ? { code: query.type } : {}),
        },
      },
    ];

    const { rows, count } = await this.mediaModel.findAndCountAll({
      where,
      include,
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'DESC'],
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit) || 0,
    };
  }

  async findOne(id: number) {
    const row = await this.mediaModel.findOne({
      where: { id, isDeleted: false },
      include: [MediaType],
    });
    if (!row) throw new NotFoundException('Media not found');
    return row;
  }

  private async resolveTypeByCode(typeCode: string) {
    const mediaType = await this.mediaTypeModel.findOne({
      where: { code: typeCode, isDeleted: false },
    });
    if (!mediaType) {
      throw new BadRequestException(
        `Media type "${typeCode}" not found. Seed media_types first.`,
      );
    }
    return mediaType;
  }

  private guessMimeFromUrl(url: string) {
    const path = url.split('?')[0].toLowerCase();
    if (path.endsWith('.png')) return 'image/png';
    if (path.endsWith('.webp')) return 'image/webp';
    if (path.endsWith('.gif')) return 'image/gif';
    if (path.endsWith('.svg')) return 'image/svg+xml';
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
    return 'image/jpeg';
  }

  /** Create media from public/external image URL (no file upload) */
  async createFromUrl(dto: CreateMediaDto, createdBy?: number) {
    const mediaType = await this.resolveTypeByCode(dto.type);
    const url = dto.url.trim();

    return this.mediaModel.create({
      mediaTypeId: mediaType.id,
      title: dto.title?.trim() || url.split('/').pop() || 'External media',
      altText: dto.altText?.trim() || null,
      url,
      storageKey: `external:${url}`,
      mimeType: this.guessMimeFromUrl(url),
      fileSize: 0,
      linkUrl: dto.linkUrl?.trim() || null,
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
      isDeleted: false,
      createdBy: createdBy ?? null,
    });
  }

  async upload(
    file: Express.Multer.File,
    options: {
      typeCode?: string;
      title?: string;
      altText?: string;
      linkUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
      createdBy?: number;
    },
  ) {
    if (!file) {
      throw new BadRequestException('File is required for upload');
    }

    const mediaType = await this.resolveTypeByCode(options.typeCode || 'general');
    const uploaded = await this.uploadService.uploadImage(file);

    return this.mediaModel.create({
      mediaTypeId: mediaType.id,
      title: options.title || file.originalname,
      altText: options.altText || null,
      url: uploaded.url,
      storageKey: uploaded.key,
      mimeType: uploaded.mimeType,
      fileSize: uploaded.size,
      linkUrl: options.linkUrl || null,
      sortOrder: options.sortOrder ?? 0,
      isActive: options.isActive ?? true,
      isDeleted: false,
      createdBy: options.createdBy ?? null,
    });
  }

  async update(id: number, dto: UpdateMediaDto) {
    const row = await this.findOne(id);
    if (dto.mediaTypeId) {
      const type = await this.mediaTypeModel.findOne({
        where: { id: dto.mediaTypeId, isDeleted: false },
      });
      if (!type) throw new BadRequestException('Media type not found');
    }

    const patch: Record<string, unknown> = { ...dto };
    if (dto.url) {
      const nextUrl = dto.url.trim();
      patch.url = nextUrl;
      if (nextUrl !== row.url) {
        patch.storageKey = `external:${nextUrl}`;
        patch.mimeType = this.guessMimeFromUrl(nextUrl);
        patch.fileSize = 0;
      }
    }

    await row.update(patch);
    return this.findOne(id);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await row.update({ isDeleted: true, isActive: false });
    return { deleted: true };
  }

  /** Active banners for public homepage */
  async getActiveBanners() {
    return this.mediaModel.findAll({
      where: { isActive: true, isDeleted: false },
      include: [
        {
          model: MediaType,
          required: true,
          where: { code: 'banner', isDeleted: false },
        },
      ],
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'DESC'],
      ],
    });
  }
}
