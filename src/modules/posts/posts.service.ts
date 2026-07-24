import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { Post } from './entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { PostStatus } from '../../common/enums';
import { paginate } from '../../common/dto/api-response.dto';
import { RedisService } from '../../common/redis/redis.service';
import { RedisCacheKeys, RedisTtlDefaults } from '../../common/redis/redis.config';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly postModel: typeof Post,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  private async invalidateSidebarCache() {
    await this.redis.del(RedisCacheKeys.SIDEBAR);
  }

  async create(dto: CreatePostDto, userId: number) {
    await this.ensureUniqueSlug(dto.slug);
    const publishedAt =
      dto.status === PostStatus.PUBLISHED ? new Date() : null;
    const created = await this.postModel.create({
      ...dto,
      publishedAt,
      createdBy: userId,
      updatedBy: userId,
      status: dto.status || PostStatus.DRAFT,
    });
    await this.invalidateSidebarCache();
    return created;
  }

  async findAll(query: PostQueryDto, admin = false) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = { isDeleted: false };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) {
      where.status = query.status;
    } else if (!admin) {
      where.status = PostStatus.PUBLISHED;
    }
    if (admin && query.withDeleted) {
      delete where.isDeleted;
    }
    if (query.search) {
      where[Op.or as unknown as string] = [
        { title: { [Op.like]: `%${query.search}%` } },
        { shortDescription: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.postModel.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'slug'],
          required: Boolean(query.categorySlug),
          ...(query.categorySlug
            ? {
                where: {
                  slug: query.categorySlug,
                  isDeleted: false,
                },
              }
            : {}),
        },
      ],
      order: [
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
      distinct: true,
    });

    return paginate(rows, count, page, limit);
  }

  async findBySlug(slug: string, ip?: string) {
    const post = await this.postModel.findOne({
      where: { slug, status: PostStatus.PUBLISHED, isDeleted: false },
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.incrementViewCount(post.id, ip);
    await post.reload({
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
    });
    return post;
  }

  async findOne(id: number, withDeleted = false) {
    const post = await this.postModel.findOne({
      where: {
        id,
        ...(withDeleted ? {} : { isDeleted: false }),
      },
      include: [{ model: Category }],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findRelated(slug: string, limit = 5) {
    const post = await this.postModel.findOne({
      where: { slug, isDeleted: false },
    });
    if (!post) throw new NotFoundException('Post not found');

    return this.postModel.findAll({
      where: {
        categoryId: post.categoryId,
        id: { [Op.ne]: post.id },
        status: PostStatus.PUBLISHED,
        isDeleted: false,
      },
      order: [['publishedAt', 'DESC']],
      limit,
      attributes: [
        'id',
        'slug',
        'title',
        'shortDescription',
        'thumbnail',
        'publishedAt',
      ],
    });
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const post = await this.findOne(id);
    if (dto.slug && dto.slug !== post.slug) {
      await this.ensureUniqueSlug(dto.slug);
    }

    const updates: Partial<Post> & Record<string, unknown> = {
      ...dto,
      updatedBy: userId,
    };

    if (dto.status === PostStatus.PUBLISHED && !post.publishedAt) {
      updates.publishedAt = new Date();
    }

    await post.update(updates);
    await this.invalidateSidebarCache();
    return post;
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await post.update({ isDeleted: true });
    await this.invalidateSidebarCache();
    return { deleted: true };
  }

  async restore(id: number) {
    const post = await this.findOne(id, true);
    await post.update({ isDeleted: false });
    await this.invalidateSidebarCache();
    return post;
  }

  private async ensureUniqueSlug(slug: string) {
    const exists = await this.postModel.findOne({
      where: { slug, isDeleted: false },
    });
    if (exists) throw new ConflictException('Slug already exists');
  }

  private async incrementViewCount(postId: number, ip?: string) {
    if (!ip) {
      await this.postModel.increment('viewCount', { where: { id: postId } });
      return;
    }
    const ttl = this.config.get<number>(
      'REDIS_TTL_VIEW',
      RedisTtlDefaults.VIEW,
    );
    const key = RedisCacheKeys.POST_VIEW(postId, ip);
    const seen = await this.redis.exists(key);
    if (seen) return;
    await this.redis.set(key, '1', ttl);
    await this.postModel.increment('viewCount', { where: { id: postId } });
  }
}
