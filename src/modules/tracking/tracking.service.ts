import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { TrackingLog } from './entities/tracking-log.entity';
import { TrackShipmentDto, TrackingLogQueryDto } from './dto/tracking.dto';
import { Carrier } from '../../common/enums';
import { RedisService } from '../../common/redis/redis.service';
import {
  RedisCacheKeys,
  RedisTtlDefaults,
} from '../../common/redis/redis.config';
import { paginate } from '../../common/dto/api-response.dto';
import { DhlAdapter } from './adapters/dhl.adapter';
import { FedexAdapter } from './adapters/fedex.adapter';
import { UpsAdapter } from './adapters/ups.adapter';
import {
  CarrierAdapter,
  NormalizedTrackingResult,
} from './adapters/carrier.adapter';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private readonly adapters: Map<Carrier, CarrierAdapter>;

  constructor(
    @InjectModel(TrackingLog)
    private readonly trackingLogModel: typeof TrackingLog,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
    private readonly dhl: DhlAdapter,
    private readonly fedex: FedexAdapter,
    private readonly ups: UpsAdapter,
  ) {
    this.adapters = new Map<Carrier, CarrierAdapter>([
      [Carrier.DHL, this.dhl],
      [Carrier.FEDEX, this.fedex],
      [Carrier.UPS, this.ups],
    ]);
  }

  async track(dto: TrackShipmentDto, ip?: string) {
    const trackingNumber = dto.trackingNumber.trim().toUpperCase();
    const carrier = dto.carrier || this.detectCarrier(trackingNumber);

    if (!carrier) {
      throw new BadRequestException(
        'Unable to detect carrier. Please select DHL, FedEx or UPS.',
      );
    }

    const cacheKey = RedisCacheKeys.TRACKING(carrier, trackingNumber);
    const ttl = this.config.get<number>(
      'REDIS_TTL_TRACKING',
      RedisTtlDefaults.TRACKING,
    );
    const cached =
      await this.redis.getJson<NormalizedTrackingResult>(cacheKey);

    if (cached) {
      await this.logQuery(trackingNumber, carrier, { ...cached, cached: true }, ip);
      return { ...cached, cached: true };
    }

    const adapter = this.adapters.get(carrier);
    if (!adapter) {
      throw new BadRequestException(`Unsupported carrier: ${carrier}`);
    }

    try {
      const result = await adapter.track(trackingNumber);
      await this.redis.setJson(cacheKey, result, ttl);
      await this.logQuery(trackingNumber, carrier, result, ip);
      return { ...result, cached: false };
    } catch (err) {
      const errorPayload = {
        trackingNumber,
        carrier,
        status: 'ERROR',
        statusDescription: (err as Error).message,
        events: [],
        error: true,
      };
      await this.logQuery(trackingNumber, carrier, errorPayload, ip);
      this.logger.error(
        `Tracking failed [${carrier}] ${trackingNumber}: ${(err as Error).message}`,
      );
      throw new BadRequestException(
        `Unable to track shipment with ${carrier}. Please try again later.`,
      );
    }
  }

  detectCarrier(trackingNumber: string): Carrier | null {
    if (this.ups.detect(trackingNumber)) return Carrier.UPS;
    if (this.dhl.detect(trackingNumber)) return Carrier.DHL;
    if (this.fedex.detect(trackingNumber)) return Carrier.FEDEX;
    return null;
  }

  async findLogs(query: TrackingLogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    const where: Record<string, unknown> = { isDeleted: false };

    if (query.carrier) where.carrier = query.carrier;
    if (query.trackingNumber) {
      where.trackingNumber = {
        [Op.like]: `%${query.trackingNumber}%`,
      };
    }

    const { rows, count } = await this.trackingLogModel.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return paginate(rows, count, page, limit);
  }

  async getStats() {
    const total = await this.trackingLogModel.count({
      where: { isDeleted: false },
    });
    const byCarrier = await this.trackingLogModel.findAll({
      attributes: [
        'carrier',
        [
          this.trackingLogModel.sequelize!.fn(
            'COUNT',
            this.trackingLogModel.sequelize!.col('id'),
          ),
          'count',
        ],
      ],
      where: { isDeleted: false },
      group: ['carrier'],
      raw: true,
    });
    return { total, byCarrier };
  }

  private async logQuery(
    trackingNumber: string,
    carrier: Carrier,
    statusResult: unknown,
    ip?: string,
  ) {
    try {
      await this.trackingLogModel.create({
        trackingNumber,
        carrier,
        statusResult: statusResult as Record<string, unknown>,
        ipAddress: ip || null,
      });
    } catch (err) {
      this.logger.error(`Failed to write tracking log: ${(err as Error).message}`);
    }
  }
}
