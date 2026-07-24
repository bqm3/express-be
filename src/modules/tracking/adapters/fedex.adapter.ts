import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Carrier } from '../../../common/enums';
import {
  CarrierAdapter,
  NormalizedTrackingResult,
} from './carrier.adapter';

@Injectable()
export class FedexAdapter implements CarrierAdapter {
  readonly carrier = Carrier.FEDEX;
  private readonly logger = new Logger(FedexAdapter.name);
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(private readonly config: ConfigService) {}

  detect(trackingNumber: string): boolean {
    return /^[0-9]{12,15}$/.test(trackingNumber);
  }

  async track(trackingNumber: string): Promise<NormalizedTrackingResult> {
    const clientId = this.config.get<string>('FEDEX_CLIENT_ID');
    const clientSecret = this.config.get<string>('FEDEX_CLIENT_SECRET');
    const baseUrl = this.config.get<string>(
      'FEDEX_BASE_URL',
      'https://apis-sandbox.fedex.com',
    );

    if (!clientId || !clientSecret) {
      this.logger.warn('FedEx credentials missing — returning mock result');
      return this.mockResult(trackingNumber);
    }

    try {
      const token = await this.getAccessToken(baseUrl, clientId, clientSecret);
      const { data } = await axios.post(
        `${baseUrl}/track/v1/trackingnumbers`,
        {
          includeDetailedScans: true,
          trackingInfo: [
            { trackingNumberInfo: { trackingNumber } },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      const result =
        data?.output?.completeTrackResults?.[0]?.trackResults?.[0];
      const events =
        result?.scanEvents?.map((e: Record<string, unknown>) => ({
          timestamp: String(e.date || ''),
          location:
            (e.scanLocation as { city?: string })?.city ||
            String(e.locationId || ''),
          description: String(e.eventDescription || ''),
          statusCode: String(e.eventType || ''),
        })) || [];

      return {
        trackingNumber,
        carrier: Carrier.FEDEX,
        status: result?.latestStatusDetail?.code || 'UNKNOWN',
        statusDescription:
          result?.latestStatusDetail?.description || 'Unknown',
        origin: result?.shipperInformation?.address?.city,
        destination: result?.recipientInformation?.address?.city,
        estimatedDelivery:
          result?.dateAndTimes?.find(
            (d: { type: string }) => d.type === 'ESTIMATED_DELIVERY',
          )?.dateTime || null,
        events,
        raw: data,
      };
    } catch (err) {
      this.logger.error(
        `FedEx track failed for ${trackingNumber}: ${(err as Error).message}`,
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
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const { data } = await axios.post(
      `${baseUrl}/oauth/token`,
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return data.access_token;
  }

  private mockResult(trackingNumber: string): NormalizedTrackingResult {
    return {
      trackingNumber,
      carrier: Carrier.FEDEX,
      status: 'IT',
      statusDescription: 'In transit (sandbox mock)',
      origin: 'Hanoi, VN',
      destination: 'New York, US',
      estimatedDelivery: null,
      events: [
        {
          timestamp: new Date().toISOString(),
          location: 'Memphis Hub',
          description: 'Arrived at FedEx hub',
          statusCode: 'AR',
        },
      ],
    };
  }
}
