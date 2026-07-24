import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ContactChannelType } from '../../../common/enums';

@Table({
  tableName: 'contact_channels',
  underscored: true,
  timestamps: true,
})
export class ContactChannel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare name: string;

  @Default(ContactChannelType.PHONE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ContactChannelType)))
  declare channel: ContactChannelType;

  /** Phone number, Zalo/Facebook URL, or email */
  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare value: string;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare displayValue: string | null;

  @Default(0)
  @Column(DataType.INTEGER)
  declare orderIndex: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
