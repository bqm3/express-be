import { IsString, IsNotEmpty, IsEnum, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '../../../common/enums';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class UserQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: AdminRole })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;
}

export class CreateUserDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Administrator' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  @ApiPropertyOptional({ enum: AdminRole, default: AdminRole.USER })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Admin User' })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  fullName?: string;

  @ApiPropertyOptional({ enum: AdminRole })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
