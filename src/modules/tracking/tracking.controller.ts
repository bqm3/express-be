import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { TrackingService } from './tracking.service';
import { TrackShipmentDto, TrackingLogQueryDto } from './dto/tracking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClientIp } from '../../common/decorators';

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Track shipment (DHL / FedEx / UPS)' })
  track(@Body() dto: TrackShipmentDto, @ClientIp() ip: string) {
    return this.trackingService.track(dto, ip);
  }

  @Get('detect')
  @ApiOperation({ summary: 'Auto-detect carrier from tracking number' })
  detect(@Query('trackingNumber') trackingNumber: string) {
    return {
      carrier: this.trackingService.detectCarrier(
        (trackingNumber || '').trim().toUpperCase(),
      ),
    };
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findLogs(@Query() query: TrackingLogQueryDto) {
    return this.trackingService.findLogs(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  stats() {
    return this.trackingService.getStats();
  }
}
