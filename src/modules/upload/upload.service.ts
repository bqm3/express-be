import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private bucketReady = false;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    this.bucket = this.config.get<string>('S3_BUCKET', 'express-uploads');
    this.publicUrl = this.config.get<string>(
      'S3_PUBLIC_URL',
      `${endpoint}/${this.bucket}`,
    );

    this.s3 = new S3Client({
      region: this.config.get<string>('S3_REGION', 'us-east-1'),
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY', 'minioadmin'),
        secretAccessKey: this.config.get<string>(
          'S3_SECRET_KEY',
          'minioadmin',
        ),
      },
    });
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    await this.ensureBucket();

    const key = `images/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extname(file.originalname)}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err) {
      this.logger.error(`Upload failed: ${(err as Error).message}`);
      throw new BadRequestException(
        'Upload failed. Check MinIO/S3 configuration.',
      );
    }

    return {
      key,
      url: `${this.publicUrl.replace(/\/$/, '')}/${key}`,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  private async ensureBucket() {
    if (this.bucketReady) return;
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.bucketReady = true;
    } catch {
      try {
        await this.s3.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.bucketReady = true;
      } catch (err) {
        this.logger.warn(`Cannot ensure bucket: ${(err as Error).message}`);
      }
    }
  }
}
