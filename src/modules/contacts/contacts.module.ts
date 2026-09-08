import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactRequest } from './entities/contact-request.entity';
import { User } from '../users/entities/user.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ContactRequest, User]),
    SettingsModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
