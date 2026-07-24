import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactChannel } from './entities/contact-channel.entity';
import { ContactChannelsService } from './contact-channels.service';
import { ContactChannelsController } from './contact-channels.controller';

@Module({
  imports: [SequelizeModule.forFeature([ContactChannel])],
  controllers: [ContactChannelsController],
  providers: [ContactChannelsService],
  exports: [ContactChannelsService],
})
export class ContactChannelsModule {}
