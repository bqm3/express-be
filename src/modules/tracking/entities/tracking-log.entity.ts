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
import { Carrier } from '../../../common/enums';

@Table({
  tableName: 'tracking_logs',
  underscored: true,
  timestamps: true,
})
export class TrackingLog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare trackingNumber: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Carrier)))
  declare carrier: Carrier;

  @AllowNull(true)
  @Column(DataType.JSON)
  declare statusResult: Record<string, unknown> | null;

  @AllowNull(true)
  @Column(DataType.STRING(45))
  declare ipAddress: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
