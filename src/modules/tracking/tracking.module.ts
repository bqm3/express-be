import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TrackingLog } from './entities/tracking-log.entity';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { DhlAdapter } from './adapters/dhl.adapter';
import { FedexAdapter } from './adapters/fedex.adapter';
import { UpsAdapter } from './adapters/ups.adapter';

@Module({
  imports: [SequelizeModule.forFeature([TrackingLog])],
  controllers: [TrackingController],
  providers: [TrackingService, DhlAdapter, FedexAdapter, UpsAdapter],
  exports: [TrackingService],
})
export class TrackingModule {}
