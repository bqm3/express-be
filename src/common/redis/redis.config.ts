/** Redis cache keys & default TTLs (seconds) */
const FOLDER = 'express';
export const RedisCacheKeys = {
  HEADER_MENU: `${FOLDER}:categories:header-menu`,
  SIDEBAR: `${FOLDER}:categories:sidebar`,
  POST_VIEW: (postId: number, ip: string) => `${FOLDER}:post:view:${postId}:${ip}`,
  TRACKING: (carrier: string, trackingNumber: string) =>
    `${FOLDER}:tracking:${carrier}:${trackingNumber}`,
} as const;

export const RedisTtlDefaults = {
  HEADER_MENU: 86400,
  SIDEBAR: 86400,
  VIEW: 3600,
  TRACKING: 600,
} as const;
