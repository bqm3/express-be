import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContactStatus } from '../../../common/enums';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class CreateContactDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => !!o.fullName)
  @IsString()
  @MaxLength(150)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => !!o.phone)
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => typeof o.email === 'string' && o.email.trim().length > 0)
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => !!o.subject)
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => !!o.message)
  @IsString()
  message?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sourcePage?: string;

  @ApiPropertyOptional({ description: 'reCAPTCHA v3 token' })
  @IsOptional()
  @IsString()
  recaptchaToken?: string;
}

export class UpdateContactDto {
  @ApiPropertyOptional({ enum: ContactStatus })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assignedTo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noteInternal?: string;
}

export class ContactQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ContactStatus })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
