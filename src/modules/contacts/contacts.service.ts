import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import * as ExcelJS from 'exceljs';
import { ContactRequest } from './entities/contact-request.entity';
import { User } from '../users/entities/user.entity';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactQueryDto,
} from './dto/contact.dto';
import { ContactStatus } from '../../common/enums';
import { paginate } from '../../common/dto/api-response.dto';

import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectModel(ContactRequest)
    private readonly contactModel: typeof ContactRequest,
    private readonly config: ConfigService,
    private readonly settingsService: SettingsService,
  ) {}

  async create(dto: CreateContactDto) {
    const fullName = dto.fullName?.trim() || '';
    const phone = dto.phone?.trim() || '';
    const email = dto.email?.trim() || '';
    const subject = dto.subject?.trim() || '';
    const message = dto.message?.trim() || '';

    if (!phone && !email) {
      throw new BadRequestException('Vui lòng nhập Số điện thoại hoặc Email');
    }

    await this.verifyRecaptcha(dto.recaptchaToken);

    const contact = await this.contactModel.create({
      fullName,
      phone,
      email,
      subject,
      message,
      sourcePage: dto.sourcePage || null,
      status: ContactStatus.NEW,
    });

    this.sendNotificationEmail(contact).catch((err) => {
      this.logger.error(`Failed to send CSKH email: ${err.message}`);
    });

    this.sendTelegramNotification(contact).catch((err) => {
      this.logger.error(`Failed to send Telegram notification: ${err.message}`);
    });

    return contact;
  }

  async findAll(query: ContactQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const where: Record<string, unknown> = { isDeleted: false };

    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { [Op.gte]: new Date(query.from) } : {}),
        ...(query.to ? { [Op.lte]: new Date(query.to) } : {}),
      };
    }
    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          { fullName: { [Op.like]: `%${query.search}%` } },
          { email: { [Op.like]: `%${query.search}%` } },
          { phone: { [Op.like]: `%${query.search}%` } },
          { subject: { [Op.like]: `%${query.search}%` } },
        ],
      });
    }

    const { rows, count } = await this.contactModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return paginate(rows, count, page, limit);
  }

  async findOne(id: number) {
    const contact = await this.contactModel.findOne({
      where: { id, isDeleted: false },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
    });
    if (!contact) throw new NotFoundException('Contact request not found');
    return contact;
  }

  async update(id: number, dto: UpdateContactDto) {
    const contact = await this.findOne(id);
    const updates: Partial<ContactRequest> = { ...dto };
    if (dto.status === ContactStatus.DONE && !contact.resolvedAt) {
      updates.resolvedAt = new Date();
    }
    await contact.update(updates);
    return this.findOne(id);
  }

  async exportExcel(query: ContactQueryDto) {
    const result = await this.findAll({ ...query, page: 1, limit: 10000 });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Contacts');
    sheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Subject', key: 'subject', width: 30 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Source', key: 'sourcePage', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 22 },
    ];

    for (const item of result.items) {
      sheet.addRow({
        fullName: item.fullName,
        phone: item.phone,
        email: item.email,
        subject: item.subject,
        status: item.status,
        sourcePage: item.sourcePage,
        createdAt: item.createdAt,
      });
    }

    return workbook.xlsx.writeBuffer();
  }

  private async verifyRecaptcha(token?: string) {
    const secret = this.config.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secret) {
      this.logger.warn('RECAPTCHA_SECRET_KEY not set — skipping verification');
      return;
    }
    if (!token) {
      throw new BadRequestException('reCAPTCHA token is required');
    }

    try {
      const { data } = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: { secret, response: token },
        },
      );
      const minScore = Number(this.config.get('RECAPTCHA_MIN_SCORE', 0.5));
      if (!data.success || (data.score !== undefined && data.score < minScore)) {
        throw new BadRequestException('reCAPTCHA verification failed');
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`reCAPTCHA error: ${(err as Error).message}`);
      throw new BadRequestException('reCAPTCHA verification failed');
    }
  }

  private async sendNotificationEmail(contact: ContactRequest) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const to = this.config.get<string>('CSKH_EMAIL');

    if (!host || !user || !pass || !to) {
      this.logger.warn('SMTP not configured — skip notification email');
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(this.config.get('SMTP_PORT', 587)),
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: this.config.get<string>('SMTP_FROM', user),
      to,
      subject: `[Liên hệ mới] ${contact.subject}`,
      text: [
        `Họ tên: ${contact.fullName}`,
        `SĐT: ${contact.phone || 'Chưa cung cấp'}`,
        `Email: ${contact.email || 'Chưa cung cấp'}`,
        `Nguồn: ${contact.sourcePage || '-'}`,
        '',
        contact.message,
      ].join('\n'),
    });
  }

  private async sendTelegramNotification(contact: ContactRequest) {
    let botToken =
      this.config.get<string>('TELEGRAM_BOT_TOKEN') ||
      '8982469312:AAGxmU48_ou-Ws6fav0O6G6t2gD_Fr0nglI';
    let chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
    let isEnabled =
      this.config.get<string>('TELEGRAM_NOTIFICATION_ENABLED', 'true') !== 'false';

    try {
      const publicSettings = await this.settingsService.getPublicSettings();
      if (publicSettings.telegram_bot_token) {
        botToken = publicSettings.telegram_bot_token;
      }
      if (publicSettings.telegram_chat_id) {
        chatId = publicSettings.telegram_chat_id;
      }
      if (publicSettings.telegram_notification_enabled !== undefined) {
        isEnabled = publicSettings.telegram_notification_enabled === 'true';
      }
    } catch (err) {
      this.logger.warn(`Could not load settings for Telegram: ${(err as Error).message}`);
    }

    if (!isEnabled) {
      this.logger.log('Telegram notification is disabled');
      return;
    }

    if (!botToken || !chatId) {
      this.logger.warn(
        `Telegram notification skipped: botToken=${botToken ? 'set' : 'missing'}, chatId=${chatId ? 'set' : 'missing'}. Please configure TELEGRAM_CHAT_ID.`,
      );
      return;
    }

    const escapeHtml = (text: string = '') =>
      text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const timeStr = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date());

    const fullNameText = contact.fullName?.trim()
      ? `<b>${escapeHtml(contact.fullName)}</b>`
      : '<i>(Không có)</i>';
    const phoneText = contact.phone?.trim()
      ? `<code>${escapeHtml(contact.phone)}</code>`
      : '<i>(Không có)</i>';
    const emailText = contact.email?.trim()
      ? escapeHtml(contact.email)
      : '<i>(Không có)</i>';
    const subjectText = contact.subject?.trim()
      ? escapeHtml(contact.subject)
      : '<i>(Không có)</i>';
    const messageText = contact.message?.trim()
      ? escapeHtml(contact.message)
      : '<i>(Không có)</i>';
    const sourceText = contact.sourcePage
      ? escapeHtml(contact.sourcePage)
      : 'https://buupham247quocte.com/lien-he';

    const messageHtml = [
      `🚨 <b>[BUUPHAM247] CÓ DỮ LIỆU LIÊN HỆ MỚI!</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Họ tên:</b> ${fullNameText}`,
      `📞 <b>Điện thoại:</b> ${phoneText}`,
      `📧 <b>Email:</b> ${emailText}`,
      `📌 <b>Tiêu đề:</b> ${subjectText}`,
      `📝 <b>Nội dung:</b>\n${messageText}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🌐 <b>Nguồn:</b> ${sourceText}`,
      `⏰ <b>Thời gian:</b> ${timeStr}`,
    ].join('\n');

    const chatIds = chatId.split(',').map((id) => id.trim()).filter(Boolean);
    for (const targetId of chatIds) {
      try {
        const { data } = await axios.post(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            chat_id: targetId,
            text: messageHtml,
            parse_mode: 'HTML',
          },
        );
        if (!data.ok) {
          this.logger.error(`Telegram API error for chat ${targetId}: ${JSON.stringify(data)}`);
        } else {
          this.logger.log(`Telegram notification sent successfully to chat ${targetId}`);
        }
      } catch (err) {
        this.logger.error(`Failed to send Telegram notification to chat ${targetId}: ${(err as Error).message}`);
      }
    }
  }
}
