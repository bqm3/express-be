import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SystemSetting } from './entities/setting.entity';

export const DEFAULT_SETTINGS: Record<string, { value: string; description: string }> = {
  header_title: {
    value: 'Dịch vụ gửi hàng đi nước ngoài uy tín — giá rẻ TP.HCM | 15 năm kinh nghiệm',
    description: 'Dòng tiêu đề phụ ở góc trái header bar',
  },
  header_hotline: {
    value: 'Hotline 0907.277.502',
    description: 'Text Hotline hiển thị ở header bar',
  },
  header_hotline_link: {
    value: 'tel:0907277502',
    description: 'Đường dẫn gọi điện ở header (VD: tel:0907277502)',
  },
  footer_hotline: {
    value: 'Hotline 0907.277.502',
    description: 'Text Hotline hiển thị ở footer',
  },
  footer_hotline_link: {
    value: 'tel:0907277502',
    description: 'Đường dẫn gọi điện ở footer (VD: tel:0907277502)',
  },
  footer_branches: {
    value: JSON.stringify([
      {
        title: '',
        address: 'Số 5 Nguyễn Văn Vĩnh, P.4, Q. Tân Bình, TP.HCM',
        phone: 'ĐT: (028) 6678 1779',
      },
      {
        title: 'GLLogistics Quy Nhơn — Bình Định',
        address: '',
        phone: 'ĐT: (056) 353 1419 — 091 442 7842',
      },
    ]),
    description: 'Danh sách địa chỉ & chi nhánh hiển thị ở footer (JSON array)',
  },
  show_google_map: {
    value: 'false',
    description: 'Bật/tắt hiển thị Google Maps ở trang Liên hệ (true/false)',
  },
  google_map_embed_url: {
    value:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0541675030704!2d106.65963037480536!3d10.8071633893435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294a17680537%3A0x1caddc4bfea2dc70!2zROG7i2NoIHbhu6UgZ-G7rWkgaMOgbmcgxJFpIE5nYSwg4bqkbiDEkOG7mSwgSMOgbiBRdeG7kWMsIE5o4bqtdCBC4bqjbiwgQW5oIMOaYyAtIEdsZXhwcmVzcw!5e0!3m2!1svi!2s!4v1784887617666!5m2!1svi!2s',
    description: 'URL Embed Google Maps',
  },
};

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(SystemSetting)
    private readonly settingModel: typeof SystemSetting,
  ) {}

  async onModuleInit() {
    try {
      await this.settingModel.sync();
      await this.ensureDefaults();
    } catch (err) {
      console.error('Error initializing system_settings table:', err);
    }
  }

  async ensureDefaults() {
    try {
      await this.settingModel.sync();
      for (const [key, meta] of Object.entries(DEFAULT_SETTINGS)) {
        const existing = await this.settingModel.findByPk(key);
        if (!existing) {
          await this.settingModel.create({
            key,
            value: meta.value,
            description: meta.description,
          });
        }
      }
    } catch (err) {
      console.error('Failed to ensure default settings:', err);
    }
  }

  async getPublicSettings(): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    // Populate defaults first
    for (const [k, meta] of Object.entries(DEFAULT_SETTINGS)) {
      result[k] = meta.value;
    }

    try {
      await this.settingModel.sync();
      const rows = await this.settingModel.findAll();
      for (const row of rows) {
        result[row.key] = row.value;
      }
    } catch (err) {
      console.error('Failed to fetch settings from DB, returning defaults:', err);
    }

    return result;
  }

  async getAdminSettings(): Promise<SystemSetting[]> {
    await this.ensureDefaults();
    try {
      return await this.settingModel.findAll();
    } catch {
      return [];
    }
  }

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    if (!settings || typeof settings !== 'object') {
      return this.getPublicSettings();
    }

    try {
      await this.settingModel.sync();
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === 'string') {
          const existing = await this.settingModel.findByPk(key);
          if (existing) {
            existing.value = value;
            await existing.save();
          } else {
            await this.settingModel.create({
              key,
              value,
              description: DEFAULT_SETTINGS[key]?.description || null,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to update settings in DB:', err);
    }

    return this.getPublicSettings();
  }
}
