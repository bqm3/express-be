import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AdminRole } from '../../common/enums';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const username = this.config.get<string>('ADMIN_USERNAME', 'admin');
    const existing = await this.userModel.findOne({
      where: { username, isDeleted: false },
    });
    if (!existing) {
      const password = this.config.get<string>('ADMIN_PASSWORD', 'Admin@123');
      const hash = await bcrypt.hash(password, 10);
      await this.userModel.create({
        username,
        passwordHash: hash,
        fullName: this.config.get<string>('ADMIN_FULL_NAME', 'System Admin'),
        role: AdminRole.ADMIN,
        isDeleted: false,
      });
      this.logger.log(`Seeded default admin user: ${username}`);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      where: { username: dto.username, isDeleted: false },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateUser(userId: number) {
    return this.userModel.findOne({
      where: { id: userId, isDeleted: false },
    });
  }
}
