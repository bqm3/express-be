import { Body, Controller, Get, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public site settings' })
  getPublicSettings() {
    return this.service.getPublicSettings();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin settings list' })
  getAdminSettings() {
    return this.service.getAdminSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system settings (PUT)' })
  updateSettingsPut(@Body() dto: UpdateSettingsDto) {
    return this.service.updateSettings(
      dto.settings || (dto as Record<string, string>) || {},
    );
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system settings (PATCH)' })
  updateSettingsPatch(@Body() dto: UpdateSettingsDto) {
    return this.service.updateSettings(
      dto.settings || (dto as Record<string, string>) || {},
    );
  }

  @Get('telegram/updates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Telegram bot updates' })
  getTelegramUpdates(@Query('botToken') botToken?: string) {
    return this.service.getTelegramUpdates(botToken);
  }

  @Post('telegram/test')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send test message via Telegram bot' })
  sendTestTelegram(@Body() body: { botToken?: string; chatId?: string }) {
    return this.service.sendTestTelegram(body.botToken, body.chatId);
  }
}
