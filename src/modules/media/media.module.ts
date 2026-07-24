import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './entities/media.entity';
import { MediaType } from './entities/media-type.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [SequelizeModule.forFeature([Media, MediaType]), UploadModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
