import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly publicUrl: string;
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    const port = this.config.get<number>('PORT', 3001);
    const appUrl = this.config.get<string>('APP_URL', `http://localhost:${port}`);
    this.publicUrl = `${appUrl}/public`;
    this.uploadDir = join(process.cwd(), 'public');
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const dateFolder = new Date().toISOString().slice(0, 10);
    const key = `images/${dateFolder}/${randomUUID()}${extname(file.originalname)}`;
    const fullPath = join(this.uploadDir, key);

    try {
      // Ensure directory exists
      await fs.mkdir(join(this.uploadDir, `images/${dateFolder}`), { recursive: true });
      
      // Write file
      await fs.writeFile(fullPath, file.buffer);
    } catch (err) {
      this.logger.error(`Upload failed: ${(err as Error).message}`);
      throw new BadRequestException('Upload failed.');
    }

    return {
      key,
      url: `${this.publicUrl}/${key}`,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
