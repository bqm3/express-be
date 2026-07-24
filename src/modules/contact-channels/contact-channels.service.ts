import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ContactChannel } from './entities/contact-channel.entity';
import {
  ContactChannelQueryDto,
  CreateContactChannelDto,
  UpdateContactChannelDto,
} from './dto/contact-channel.dto';
import { paginate } from '../../common/dto/api-response.dto';

@Injectable()
export class ContactChannelsService {
  constructor(
    @InjectModel(ContactChannel)
    private readonly channelModel: typeof ContactChannel,
  ) {}

  /** Public: active channels for homepage / sidebar */
  async findPublic() {
    return this.channelModel.findAll({
      where: { isActive: true, isDeleted: false },
      order: [
        ['orderIndex', 'ASC'],
        ['id', 'ASC'],
      ],
      attributes: [
        'id',
        'name',
        'channel',
        'value',
        'displayValue',
        'orderIndex',
      ],
    });
  }

  async findAll(query: ContactChannelQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const where: Record<string, unknown> = { isDeleted: false };

    if (query.channel) where.channel = query.channel;

    const search = query.search?.trim();
    if (search) {
      const like = `%${search}%`;
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.like]: like } },
          { value: { [Op.like]: like } },
          { displayValue: { [Op.like]: like } },
          { channel: { [Op.like]: like } },
        ],
      });
    }

    const { rows, count } = await this.channelModel.findAndCountAll({
      where,
      order: [
        ['orderIndex', 'ASC'],
        ['id', 'ASC'],
      ],
      limit,
      offset,
    });

    return paginate(rows, count, page, limit);
  }

  async findOne(id: number) {
    const row = await this.channelModel.findOne({
      where: { id, isDeleted: false },
    });
    if (!row) throw new NotFoundException('Contact channel not found');
    return row;
  }

  async create(dto: CreateContactChannelDto) {
    return this.channelModel.create({
      name: dto.name,
      channel: dto.channel,
      value: dto.value,
      displayValue: dto.displayValue ?? null,
      orderIndex: dto.orderIndex ?? 0,
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: number, dto: UpdateContactChannelDto) {
    const row = await this.findOne(id);
    await row.update(dto);
    return row;
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await row.update({ isDeleted: true, isActive: false });
    return { success: true };
  }
}
