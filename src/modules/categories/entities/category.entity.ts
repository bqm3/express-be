import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  HasMany,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Post } from '../../posts/entities/post.entity';

@Table({
  tableName: 'categories',
  underscored: true,
  timestamps: true,
})
export class Category extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  declare name: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(200))
  declare slug: string;

  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare parentId: number | null;

  @BelongsTo(() => Category, { foreignKey: 'parentId', as: 'parent' })
  declare parent?: Category;

  @HasMany(() => Category, { foreignKey: 'parentId', as: 'children' })
  declare children?: Category[];

  @Default(0)
  @Column(DataType.INTEGER)
  declare orderIndex: number;

  /** Hiển thị trên menu header (cha + con) */
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare showInHeaderMenu: boolean;

  /** Hiển thị block danh mục ở sidebar nội dung */
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare showInSidebar: boolean;

  /** Mô tả ngắn */
  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare shortDescription: string | null;

  /** HTML mô tả danh mục */
  @AllowNull(true)
  @Column(DataType.TEXT('long'))
  declare content: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Post)
  declare posts?: Post[];
}
