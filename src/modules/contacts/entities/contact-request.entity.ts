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
import { ContactStatus } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'contact_requests',
  underscored: true,
  timestamps: true,
})
export class ContactRequest extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare fullName: string;

  @AllowNull(false)
  @Column(DataType.STRING(30))
  declare phone: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare subject: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare message: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare sourcePage: string | null;

  @AllowNull(false)
  @Default(ContactStatus.NEW)
  @Column(DataType.ENUM(...Object.values(ContactStatus)))
  declare status: ContactStatus;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare assignedTo: number | null;

  @BelongsTo(() => User, { foreignKey: 'assignedTo', as: 'assignee' })
  declare assignee?: User;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare noteInternal: string | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare resolvedAt: Date | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
