import { Carrier } from '../../../common/enums';

export interface TrackingEvent {
  timestamp: string;
  location?: string;
  description: string;
  statusCode?: string;
}

export interface NormalizedTrackingResult {
  trackingNumber: string;
  carrier: Carrier;
  status: string;
  statusDescription: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string | null;
  events: TrackingEvent[];
  raw?: unknown;
  cached?: boolean;
}

export interface CarrierAdapter {
  readonly carrier: Carrier;
  track(trackingNumber: string): Promise<NormalizedTrackingResult>;
  detect?(trackingNumber: string): boolean;
}
