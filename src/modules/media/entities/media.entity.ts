import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { MediaType } from './media-type.entity';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'medias',
  underscored: true,
  timestamps: true,
})
export class Media extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => MediaType)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare mediaTypeId: number;

  @BelongsTo(() => MediaType)
  declare mediaType?: MediaType;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare title: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare altText: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare url: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare storageKey: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare mimeType: string;

  @Default(0)
  @Column(DataType.INTEGER)
  declare fileSize: number;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare linkUrl: string | null;

  @Default(0)
  @Column(DataType.INTEGER)
  declare sortOrder: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare createdBy: number | null;

  @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
  declare creator?: User;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
