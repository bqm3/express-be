import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AdminPostsController } from '../admin/admin-posts.controller';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  controllers: [PostsController, AdminPostsController],
  providers: [PostsService],
  exports: [PostsService, SequelizeModule],
})
export class PostsModule {}
