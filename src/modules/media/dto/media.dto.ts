import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MediaQueryDto {
  @ApiPropertyOptional({ example: 'banner', description: 'media_types.code' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class CreateMediaDto {
  @ApiProperty({
    example: 'banner',
    description: 'media_types.code',
  })
  @IsString()
  @MaxLength(50)
  type: string;

  @ApiProperty({
    example: 'https://cdn.example.com/banner.jpg',
    description: 'Public image URL (external or CDN)',
  })
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'url must be a valid URL' })
  @MaxLength(500)
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @ApiPropertyOptional({ description: 'URL khi click' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  linkUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @MaxLength(255)
  altText?: string | null;

  @ApiPropertyOptional({
    description: 'Public image URL (có thể đổi sang link ngoài)',
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'url must be a valid URL' })
  @MaxLength(500)
  url?: string;

  @ApiPropertyOptional({ description: 'URL khi click banner', nullable: true })
  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @MaxLength(500)
  linkUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Đổi loại media (media_types.id)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mediaTypeId?: number;
}

export class CreateMediaTypeDto {
  @ApiProperty({ example: 'banner' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Banner' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateMediaTypeDto extends PartialType(CreateMediaTypeDto) {}
