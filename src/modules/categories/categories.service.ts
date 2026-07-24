import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { Category } from './entities/category.entity';
import { Post } from '../posts/entities/post.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PostStatus } from '../../common/enums';
import { paginate } from '../../common/dto/api-response.dto';
import { RedisService } from '../../common/redis/redis.service';
import {
  RedisCacheKeys,
  RedisTtlDefaults,
} from '../../common/redis/redis.config';

export type ResolveSlugType = 'category_list' | 'single_post';

export interface MenuCategoryItem {
  id: number;
  name: string;
  slug: string;
  orderIndex: number;
  children?: MenuCategoryItem[];
}

export interface SidebarCategoryBlock {
  id: number;
  name: string;
  slug: string;
  orderIndex: number;
  posts: { id: number; slug: string; title: string }[];
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(Post) private readonly postModel: typeof Post,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async invalidateHeaderMenuCache() {
    await this.redis.del(RedisCacheKeys.HEADER_MENU);
  }

  async invalidateSidebarCache() {
    await this.redis.del(RedisCacheKeys.SIDEBAR);
  }

  async invalidatePublicCaches() {
    await Promise.all([
      this.invalidateHeaderMenuCache(),
      this.invalidateSidebarCache(),
    ]);
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.categoryModel.findOne({
      where: { slug: dto.slug, isDeleted: false },
    });
    if (exists) throw new ConflictException('Slug already exists');
    const created = await this.categoryModel.create({
      ...dto,
      isDeleted: false,
    });
    await this.invalidatePublicCaches();
    return created;
  }

  async findAll() {
    return this.categoryModel.findAll({
      where: { isDeleted: false },
      order: [
        ['orderIndex', 'ASC'],
        ['name', 'ASC'],
      ],
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false },
        },
      ],
    });
  }

  async findTree() {
    return this.categoryModel.findAll({
      where: {
        parentId: { [Op.is]: null },
        isDeleted: false,
      },
      order: [['orderIndex', 'ASC']],
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false },
          include: [
            {
              model: Category,
              as: 'children',
              required: false,
              where: { isDeleted: false },
            },
          ],
        },
      ],
    });
  }

  /** Menu header: category cha + category con (showInHeaderMenu) */
  async getMenu(): Promise<MenuCategoryItem[]> {
    const cached = await this.redis.getJson<MenuCategoryItem[]>(
      RedisCacheKeys.HEADER_MENU,
    );
    if (cached) return cached;

    const menu = await this.buildMenu();
    const ttl = this.config.get<number>(
      'REDIS_TTL_MENU',
      RedisTtlDefaults.HEADER_MENU,
    );
    await this.redis.setJson(RedisCacheKeys.HEADER_MENU, menu, ttl);
    return menu;
  }

  /** Sidebar content: categories (showInSidebar) + posts */
  async getSidebar(): Promise<SidebarCategoryBlock[]> {
    const cached = await this.redis.getJson<SidebarCategoryBlock[]>(
      RedisCacheKeys.SIDEBAR,
    );
    if (cached) return cached;

    const sidebar = await this.buildSidebar();
    const ttl = this.config.get<number>(
      'REDIS_TTL_SIDEBAR',
      RedisTtlDefaults.SIDEBAR,
    );
    await this.redis.setJson(RedisCacheKeys.SIDEBAR, sidebar, ttl);
    return sidebar;
  }

  private async buildSidebar(): Promise<SidebarCategoryBlock[]> {
    const categories = await this.categoryModel.findAll({
      where: {
        isDeleted: false,
        showInSidebar: true,
      },
      order: [
        ['orderIndex', 'ASC'],
        ['name', 'ASC'],
      ],
      attributes: ['id', 'name', 'slug', 'orderIndex'],
    });

    const blocks: SidebarCategoryBlock[] = [];
    for (const cat of categories) {
      const posts = await this.postModel.findAll({
        where: {
          categoryId: cat.id,
          status: PostStatus.PUBLISHED,
          isDeleted: false,
        },
        order: [
          ['publishedAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit: 12,
        attributes: ['id', 'slug', 'title'],
      });

      blocks.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        orderIndex: cat.orderIndex,
        posts: posts.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
        })),
      });
    }

    return blocks;
  }

  private async buildMenu(): Promise<MenuCategoryItem[]> {
    const roots = await this.categoryModel.findAll({
      where: {
        parentId: { [Op.is]: null },
        isDeleted: false,
        showInHeaderMenu: true,
      },
      order: [
        ['orderIndex', 'ASC'],
        ['name', 'ASC'],
      ],
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false, showInHeaderMenu: true },
          separate: true,
          order: [
            ['orderIndex', 'ASC'],
            ['name', 'ASC'],
          ],
        },
      ],
    });

    return roots.map((root) => {
      const children = (root.children || []).map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        orderIndex: child.orderIndex,
      }));

      return {
        id: root.id,
        name: root.name,
        slug: root.slug,
        orderIndex: root.orderIndex,
        children: children.length ? children : undefined,
      };
    });
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findOne({
      where: { id, isDeleted: false },
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false },
        },
      ],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryModel.findOne({
      where: { slug, isDeleted: false },
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false },
        },
      ],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  /**
   * Resolve public /[slug]:
   * - category trước (menu/submenu luôn ra PostList)
   * - không phải category → post published → single_post
   */
  async resolveSlug(
    slug: string,
    query: { page?: number; limit?: number } = {},
  ) {
    const page = query.page || 1;
    const limit = query.limit || 12;

    const category = await this.categoryModel.findOne({
      where: { slug, isDeleted: false },
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false },
          attributes: ['id', 'name', 'slug', 'orderIndex'],
        },
      ],
    });

    if (category) {
      const childIds = (category.children || []).map((c) => c.id);
      const categoryIds = [category.id, ...childIds];
      const offset = (page - 1) * limit;

      const { rows, count } = await this.postModel.findAndCountAll({
        where: {
          categoryId: { [Op.in]: categoryIds },
          status: PostStatus.PUBLISHED,
          isDeleted: false,
        },
        include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
        order: [
          ['publishedAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit,
        offset,
        distinct: true,
      });

      const pagination = paginate(rows, count, page, limit);

      return {
        type: 'category_list' as const,
        category,
        posts: pagination.items,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        },
      };
    }

    const post = await this.postModel.findOne({
      where: { slug, status: PostStatus.PUBLISHED, isDeleted: false },
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy trang');
    }

    await this.postModel.increment('viewCount', { where: { id: post.id } });
    await post.reload({
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
    });

    const relatedPosts = await this.postModel.findAll({
      where: {
        categoryId: post.categoryId,
        id: { [Op.ne]: post.id },
        status: PostStatus.PUBLISHED,
        isDeleted: false,
      },
      order: [['publishedAt', 'DESC']],
      limit: 6,
      attributes: [
        'id',
        'slug',
        'title',
        'shortDescription',
        'thumbnail',
        'publishedAt',
      ],
    });

    return {
      type: 'single_post' as const,
      post,
      related_posts: relatedPosts,
    };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (dto.slug && dto.slug !== category.slug) {
      const exists = await this.categoryModel.findOne({
        where: { slug: dto.slug, isDeleted: false },
      });
      if (exists) throw new ConflictException('Slug already exists');
    }
    await category.update(dto);
    await this.invalidatePublicCaches();
    return category;
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    const childCount = await this.categoryModel.count({
      where: { parentId: id, isDeleted: false },
    });
    if (childCount > 0) {
      throw new ConflictException(
        `Không thể xóa: còn ${childCount} danh mục con. Hãy xóa hoặc chuyển danh mục con trước.`,
      );
    }

    const postCount = await this.postModel.count({
      where: { categoryId: id, isDeleted: false },
    });
    if (postCount > 0) {
      const samples = await this.postModel.findAll({
        where: { categoryId: id, isDeleted: false },
        attributes: ['title'],
        order: [['id', 'ASC']],
        limit: 5,
      });
      const titles = samples.map((p) => p.title).join(', ');
      const more = postCount > 5 ? `… (+${postCount - 5})` : '';
      throw new ConflictException(
        `Không thể xóa: còn ${postCount} bài viết đang dùng danh mục này (${titles}${more}). Hãy chuyển hoặc xóa bài viết trước.`,
      );
    }

    await category.update({ isDeleted: true });
    await this.invalidatePublicCaches();
    return { deleted: true };
  }

  /** Admin: phân trang category cha, kèm children + postCount */
  async findAllWithPostCount(query: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 15;
    const offset = (page - 1) * limit;
    const search = query.search?.trim();

    const rootWhere: Record<string, unknown> = {
      isDeleted: false,
      parentId: { [Op.is]: null },
    };

    if (search) {
      const like = `%${search}%`;
      const matchingChildren = await this.categoryModel.findAll({
        attributes: ['parentId'],
        where: {
          isDeleted: false,
          parentId: { [Op.ne]: null },
          [Op.or]: [{ name: { [Op.like]: like } }, { slug: { [Op.like]: like } }],
        },
        raw: true,
      });
      const parentIdsFromChildren = [
        ...new Set(
          matchingChildren
            .map((r) => Number((r as { parentId: number }).parentId))
            .filter(Boolean),
        ),
      ];

      rootWhere[Op.or as unknown as string] = [
        { name: { [Op.like]: like } },
        { slug: { [Op.like]: like } },
        ...(parentIdsFromChildren.length
          ? [{ id: { [Op.in]: parentIdsFromChildren } }]
          : []),
      ];
    }

    const { rows, count } = await this.categoryModel.findAndCountAll({
      where: rootWhere,
      include: [
        {
          model: Category,
          as: 'children',
          required: false,
          where: { isDeleted: false },
          separate: true,
          order: [
            ['orderIndex', 'ASC'],
            ['name', 'ASC'],
          ],
        },
      ],
      order: [
        ['orderIndex', 'ASC'],
        ['name', 'ASC'],
      ],
      limit,
      offset,
      distinct: true,
    });

    const allIds = new Set<number>();
    for (const root of rows) {
      allIds.add(root.id);
      for (const child of root.children || []) allIds.add(child.id);
    }

    const countMap = new Map<number, number>();
    if (allIds.size) {
      const countRows = (await this.postModel.findAll({
        attributes: [
          'categoryId',
          [
            this.postModel.sequelize!.fn(
              'COUNT',
              this.postModel.sequelize!.col('id'),
            ),
            'postCount',
          ],
        ],
        where: {
          categoryId: { [Op.in]: [...allIds] },
          isDeleted: false,
        },
        group: ['categoryId'],
        raw: true,
      })) as unknown as { categoryId: number; postCount: string | number }[];

      for (const r of countRows) {
        countMap.set(Number(r.categoryId), Number(r.postCount));
      }
    }

    const items = rows.map((root) => {
      const json = root.toJSON() as Category & {
        children?: Category[];
        postCount?: number;
        childCount?: number;
      };
      const children = (json.children || []).map((child) => ({
        ...child,
        postCount: countMap.get(child.id) || 0,
      }));

      return {
        ...json,
        postCount: countMap.get(root.id) || 0,
        childCount: children.length,
        children,
      };
    });

    return paginate(items, count, page, limit);
  }
}
