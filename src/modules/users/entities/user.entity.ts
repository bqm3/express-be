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
import { AdminRole } from '../../../common/enums';
import { ContactRequest } from '../../contacts/entities/contact-request.entity';

@Table({
  tableName: 'users',
  underscored: true,
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare username: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare passwordHash: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare fullName: string;

  @AllowNull(false)
  @Default(AdminRole.MANAGER)
  @Column(DataType.ENUM(...Object.values(AdminRole)))
  declare role: AdminRole;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => ContactRequest, 'assignedTo')
  declare assignedContacts: ContactRequest[];
}

/** @deprecated Use User — alias for gradual migration */
export { User as AdminUser };
