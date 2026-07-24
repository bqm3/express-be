import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContactChannelType } from '../../../common/enums';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class CreateContactChannelDto {
  @ApiProperty({ example: 'Ms. Vy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ enum: ContactChannelType, example: ContactChannelType.PHONE })
  @IsEnum(ContactChannelType)
  channel: ContactChannelType;

  @ApiProperty({
    example: '0907277502',
    description: 'SĐT (digits) hoặc URL Zalo/Facebook hoặc email',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  value: string;

  @ApiPropertyOptional({ example: '0907.277.502' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayValue?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderIndex?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateContactChannelDto extends PartialType(
  CreateContactChannelDto,
) {}

export class ContactChannelQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Tìm theo tên, giá trị, loại' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ContactChannelType })
  @IsOptional()
  @IsEnum(ContactChannelType)
  channel?: ContactChannelType;
}
