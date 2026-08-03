import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from './common/redis/redis.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PostsModule } from './modules/posts/posts.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { UploadModule } from './modules/upload/upload.module';
import { MediaModule } from './modules/media/media.module';
import { ContactChannelsModule } from './modules/contact-channels/contact-channels.module';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Post } from './modules/posts/entities/post.entity';
import { ContactRequest } from './modules/contacts/entities/contact-request.entity';
import { TrackingLog } from './modules/tracking/entities/tracking-log.entity';
import { Media } from './modules/media/entities/media.entity';
import { MediaType } from './modules/media/entities/media-type.entity';
import { ContactChannel } from './modules/contact-channels/entities/contact-channel.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(config.get('THROTTLE_TTL', 60)) * 1000,
          limit: Number(config.get('THROTTLE_LIMIT', 200)),
        },
      ],
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'express'),
        models: [
          User,
          Category,
          Post,
          ContactRequest,
          TrackingLog,
          MediaType,
          Media,
          ContactChannel,
        ],
        autoLoadModels: true,
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development' ? console.log : false,
        dialectOptions: {
          charset: 'utf8mb4',
        },
        define: {
          underscored: true,
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public',
    }),
    RedisModule,
    AuthModule,
    CategoriesModule,
    PostsModule,
    ContactsModule,
    TrackingModule,
    UploadModule,
    MediaModule,
    ContactChannelsModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
