import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { paginate } from '../../common/dto/api-response.dto';
import { UserQueryDto, CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findAll(query: UserQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (query.role) {
      where.role = query.role;
    }
    if (query.search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${query.search}%` } },
        { fullName: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return paginate(rows, count, page, limit);
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userModel.findOne({
      where: { username: dto.username, isDeleted: false },
    });
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.userModel.create({
      username: dto.username,
      passwordHash,
      fullName: dto.fullName,
      role: dto.role,
    });

    const userJson = user.toJSON();
    delete userJson.passwordHash;
    return userJson;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update(dto);

    const userJson = user.toJSON();
    delete userJson.passwordHash;
    return userJson;
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await user.update({ passwordHash });

    return { success: true, message: 'Password updated successfully' };
  }

  async remove(id: number) {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Prevent deleting the last admin or the admin currently logged in (could be handled in controller)
    // For now, just soft delete
    await user.update({ isDeleted: true });
    return { success: true, message: 'User deleted successfully' };
  }
}
