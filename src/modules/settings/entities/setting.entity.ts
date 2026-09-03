import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'system_settings',
  underscored: true,
  timestamps: true,
})
export class SystemSetting extends Model {
  @PrimaryKey
  @Column(DataType.STRING(100))
  declare key: string;

  @Column(DataType.TEXT)
  declare value: string;

  @Column(DataType.STRING(255))
  declare description: string | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
