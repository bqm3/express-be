import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'dich-vu-my' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === '' || value === undefined ? null : Number(value),
  )
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsInt()
  parentId?: number | null;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({
    description: 'Hiển thị danh mục trên menu header',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  showInHeaderMenu?: boolean;

  @ApiPropertyOptional({
    description: 'Hiển thị block danh mục ở sidebar',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  showInSidebar?: boolean;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  shortDescription?: string | null;

  @ApiPropertyOptional({
    description: 'Nội dung HTML của danh mục',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  content?: string | null;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Kèm số bài viết + phân trang (admin)',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  withPostCount?: boolean;
}
