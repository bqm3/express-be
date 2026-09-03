import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({
    description: 'Dictionary of setting key-value pairs',
    example: {
      header_title: 'Dịch vụ gửi hàng đi nước ngoài uy tín — giá rẻ TP.HCM | 15 năm kinh nghiệm',
      header_hotline: 'Hotline 0907.277.502',
      header_hotline_link: 'tel:0907277502',
      footer_hotline: 'Hotline 0907.277.502',
      footer_hotline_link: 'tel:0907277502',
      show_google_map: 'false',
    },
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, string>;
}
