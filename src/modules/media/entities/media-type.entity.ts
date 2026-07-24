import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Media } from './media.entity';

@Table({
  tableName: 'media_types',
  underscored: true,
  timestamps: true,
})
export class MediaType extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare code: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare description: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Media)
  declare media?: Media[];
}
