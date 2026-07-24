export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ContactStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  DONE = 'done',
  SPAM = 'spam',
}

export enum Carrier {
  DHL = 'DHL',
  FEDEX = 'FEDEX',
  UPS = 'UPS',
}

export enum AdminRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

export enum ContactChannelType {
  PHONE = 'phone',
  ZALO = 'zalo',
  FACEBOOK = 'facebook',
  EMAIL = 'email',
  OTHER = 'other',
}
