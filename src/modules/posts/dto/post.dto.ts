import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PostStatus } from '../../../common/enums';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';


export class CreatePostDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 'gui-hang-di-my' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Keywords SEO, cách nhau bởi dấu phẩy' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaKeywords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ogTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  twitterTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitterDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  twitterImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: 'index,follow' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  robotsMeta?: string;

  @ApiPropertyOptional({ description: 'Từ khóa chính SEO/MKT' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  focusKeyword?: string;

  @ApiPropertyOptional({ example: 'Article', description: 'JSON-LD schema type' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  schemaType?: string;

  @ApiPropertyOptional({ description: 'Headline chạy Google/Facebook Ads' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  adsHeadline?: string;

  @ApiPropertyOptional({ description: 'Mô tả quảng cáo MKT' })
  @IsOptional()
  @IsString()
  adsDescription?: string;

  @ApiPropertyOptional({ description: 'Ảnh creative quảng cáo' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  adsImage?: string;

  @ApiPropertyOptional({ description: 'UTM campaign mặc định cho landing' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmCampaign?: string;

  @ApiPropertyOptional({ description: 'Google Ads conversion label' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  conversionLabel?: string;

  @ApiPropertyOptional({ enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class PostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Lọc theo slug danh mục (vd: cam-nang)',
  })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Include soft-deleted (admin only)' })
  @IsOptional()
  @Type(() => Boolean)
  withDeleted?: boolean;
}
