import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Carrier } from '../../../common/enums';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class TrackShipmentDto {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  trackingNumber: string;

  @ApiPropertyOptional({
    enum: Carrier,
    description: 'Optional — auto-detect if omitted',
  })
  @IsOptional()
  @IsEnum(Carrier)
  carrier?: Carrier;
}

export class TrackingLogQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Carrier })
  @IsOptional()
  @IsEnum(Carrier)
  carrier?: Carrier;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
