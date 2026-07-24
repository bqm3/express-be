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

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectModel(ContactRequest)
    private readonly contactModel: typeof ContactRequest,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateContactDto) {
    await this.verifyRecaptcha(dto.recaptchaToken);

    const contact = await this.contactModel.create({
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      sourcePage: dto.sourcePage,
      status: ContactStatus.NEW,
    });

    this.sendNotificationEmail(contact).catch((err) => {
      this.logger.error(`Failed to send CSKH email: ${err.message}`);
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
        `SĐT: ${contact.phone}`,
        `Email: ${contact.email}`,
        `Nguồn: ${contact.sourcePage || '-'}`,
        '',
        contact.message,
      ].join('\n'),
    });
  }
}
