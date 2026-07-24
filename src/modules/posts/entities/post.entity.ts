import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { PostStatus } from '../../../common/enums';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'posts',
  underscored: true,
  timestamps: true,
})
export class Post extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare categoryId: number;

  @BelongsTo(() => Category)
  declare category?: Category;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare slug: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare shortDescription: string | null;

  @AllowNull(false)
  @Column(DataType.TEXT('long'))
  declare content: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare thumbnail: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare metaTitle: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare metaDescription: string | null;

  /** SEO / Ads metadata — phục vụ quảng cáo & MKT */
  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare metaKeywords: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare ogTitle: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare ogDescription: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare ogImage: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare twitterTitle: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare twitterDescription: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare twitterImage: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare canonicalUrl: string | null;

  @AllowNull(true)
  @Default('index,follow')
  @Column(DataType.STRING(100))
  declare robotsMeta: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare focusKeyword: string | null;

  @AllowNull(true)
  @Default('Article')
  @Column(DataType.STRING(50))
  declare schemaType: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare adsHeadline: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare adsDescription: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare adsImage: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare utmCampaign: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare conversionLabel: string | null;

  @AllowNull(false)
  @Default(PostStatus.DRAFT)
  @Column(DataType.ENUM(...Object.values(PostStatus)))
  declare status: PostStatus;

  @Default(0)
  @Column(DataType.INTEGER)
  declare viewCount: number;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare publishedAt: Date | null;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare createdBy: number | null;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare updatedBy: number | null;

  @BelongsTo(() => User, 'createdBy')
  declare creator?: User;

  @BelongsTo(() => User, 'updatedBy')
  declare updater?: User;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;
}
