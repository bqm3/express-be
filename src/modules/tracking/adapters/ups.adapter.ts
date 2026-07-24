import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Carrier } from '../../../common/enums';
import {
  CarrierAdapter,
  NormalizedTrackingResult,
} from './carrier.adapter';

@Injectable()
export class UpsAdapter implements CarrierAdapter {
  readonly carrier = Carrier.UPS;
  private readonly logger = new Logger(UpsAdapter.name);
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(private readonly config: ConfigService) {}

  detect(trackingNumber: string): boolean {
    return /^1Z[A-Z0-9]{16}$/i.test(trackingNumber);
  }

  async track(trackingNumber: string): Promise<NormalizedTrackingResult> {
    const clientId = this.config.get<string>('UPS_CLIENT_ID');
    const clientSecret = this.config.get<string>('UPS_CLIENT_SECRET');
    const baseUrl = this.config.get<string>(
      'UPS_BASE_URL',
      'https://wwwcie.ups.com',
    );

    if (!clientId || !clientSecret) {
      this.logger.warn('UPS credentials missing — returning mock result');
      return this.mockResult(trackingNumber);
    }

    try {
      const token = await this.getAccessToken(baseUrl, clientId, clientSecret);
      const { data } = await axios.get(
        `${baseUrl}/api/track/v1/details/${encodeURIComponent(trackingNumber)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            transId: `track-${Date.now()}`,
            transactionSrc: 'express-courier',
          },
          timeout: 15000,
        },
      );

      const shipment =
        data?.trackResponse?.shipment?.[0]?.package?.[0] ||
        data?.trackResponse?.shipment?.[0];
      const activities = shipment?.activity || [];
      const events = activities.map((a: Record<string, unknown>) => ({
        timestamp: `${a.date || ''} ${a.time || ''}`.trim(),
        location:
          (a.location as { address?: { city?: string } })?.address?.city || '',
        description: String(
          (a.status as { description?: string })?.description || '',
        ),
        statusCode: String((a.status as { code?: string })?.code || ''),
      }));

      return {
        trackingNumber,
        carrier: Carrier.UPS,
        status: events[0]?.statusCode || 'UNKNOWN',
        statusDescription: events[0]?.description || 'Unknown',
        origin: undefined,
        destination: shipment?.packageAddress?.[0]?.address?.city,
        estimatedDelivery: shipment?.deliveryDate?.[0]?.date || null,
        events,
        raw: data,
      };
    } catch (err) {
      this.logger.error(
        `UPS track failed for ${trackingNumber}: ${(err as Error).message}`,
      );
      throw err;
    }
  }

  private async getAccessToken(
    baseUrl: string,
    clientId: string,
    clientSecret: string,
  ) {
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
      return this.tokenCache.token;
    }
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const { data } = await axios.post(
      `${baseUrl}/security/v1/oauth/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basic}`,
        },
      },
    );

    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (Number(data.expires_in) - 60) * 1000,
    };
    return data.access_token;
  }

  private mockResult(trackingNumber: string): NormalizedTrackingResult {
    return {
      trackingNumber,
      carrier: Carrier.UPS,
      status: 'I',
      statusDescription: 'In Transit (sandbox mock)',
      origin: 'Da Nang, VN',
      destination: 'Chicago, US',
      estimatedDelivery: null,
      events: [
        {
          timestamp: new Date().toISOString(),
          location: 'Louisville Hub',
          description: 'Package in transit to destination',
          statusCode: 'I',
        },
      ],
    };
  }
}
