import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Carrier } from '../../../common/enums';
import {
  CarrierAdapter,
  NormalizedTrackingResult,
} from './carrier.adapter';

@Injectable()
export class DhlAdapter implements CarrierAdapter {
  readonly carrier = Carrier.DHL;
  private readonly logger = new Logger(DhlAdapter.name);

  constructor(private readonly config: ConfigService) {}

  detect(trackingNumber: string): boolean {
    return /^[0-9]{10,11}$/.test(trackingNumber) || /^JD\d+/i.test(trackingNumber);
  }

  async track(trackingNumber: string): Promise<NormalizedTrackingResult> {
    const apiKey = this.config.get<string>('DHL_API_KEY');
    const baseUrl = this.config.get<string>(
      'DHL_BASE_URL',
      'https://api-eu.dhl.com',
    );

    if (!apiKey) {
      this.logger.warn('DHL_API_KEY missing — returning mock sandbox result');
      return this.mockResult(trackingNumber);
    }

    try {
      const { data } = await axios.get(`${baseUrl}/track/shipments`, {
        params: { trackingNumber },
        headers: {
          'DHL-API-Key': apiKey,
          Accept: 'application/json',
        },
        timeout: 15000,
      });

      const shipment = data?.shipments?.[0];
      const events =
        shipment?.events?.map((e: Record<string, unknown>) => {
          const loc = e.location as
            | { address?: { addressLocality?: string } }
            | string
            | undefined;
          const location =
            typeof loc === 'string'
              ? loc
              : loc?.address?.addressLocality || '';
          return {
            timestamp: String(e.timestamp || e.date || ''),
            location,
            description: String(e.description || e.status || ''),
            statusCode: String(e.statusCode || e.status || ''),
          };
        }) || [];

      return {
        trackingNumber,
        carrier: Carrier.DHL,
        status: shipment?.status?.statusCode || shipment?.status?.status || 'UNKNOWN',
        statusDescription:
          shipment?.status?.description || shipment?.status?.status || 'Unknown',
        origin: shipment?.origin?.address?.addressLocality,
        destination: shipment?.destination?.address?.addressLocality,
        estimatedDelivery: shipment?.estimatedTimeOfDelivery || null,
        events,
        raw: data,
      };
    } catch (err) {
      this.logger.error(
        `DHL track failed for ${trackingNumber}: ${(err as Error).message}`,
      );
      throw err;
    }
  }

  private mockResult(trackingNumber: string): NormalizedTrackingResult {
    const now = new Date();
    return {
      trackingNumber,
      carrier: Carrier.DHL,
      status: 'IN_TRANSIT',
      statusDescription: 'Shipment is in transit (sandbox mock)',
      origin: 'Ho Chi Minh City, VN',
      destination: 'Los Angeles, US',
      estimatedDelivery: new Date(now.getTime() + 3 * 86400000).toISOString(),
      events: [
        {
          timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(),
          location: 'Ho Chi Minh City, VN',
          description: 'Shipment picked up',
          statusCode: 'PU',
        },
        {
          timestamp: new Date(now.getTime() - 86400000).toISOString(),
          location: 'Singapore Hub',
          description: 'Processed at origin facility',
          statusCode: 'AF',
        },
        {
          timestamp: now.toISOString(),
          location: 'In transit',
          description: 'Departed facility',
          statusCode: 'DF',
        },
      ],
    };
  }
}
