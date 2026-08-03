import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserQueryDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminRole } from '../../common/enums';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all active users' })
  findAll(@Request() req: any, @Query() query: UserQueryDto) {
    if (req.user.role !== AdminRole.ADMIN) {
      throw new ForbiddenException('Only admin can list users');
    }
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    if (req.user.role !== AdminRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() dto: CreateUserDto, @Request() req: any) {
    if (req.user.role !== AdminRole.ADMIN) {
      throw new ForbiddenException('Only admin can create users');
    }
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    if (req.user.role !== AdminRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    if (req.user.role !== AdminRole.ADMIN && dto.role && dto.role !== req.user.role) {
      throw new ForbiddenException('You cannot change your own role');
    }
    return this.usersService.update(id, dto);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
    @Request() req: any,
  ) {
    if (req.user.role !== AdminRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('You can only change your own password');
    }
    return this.usersService.changePassword(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    if (req.user.role !== AdminRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete users');
    }
    return this.usersService.remove(id);
  }
}
