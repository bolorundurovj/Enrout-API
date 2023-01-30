import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  description: string;

  @ApiPropertyOptional()
  attachment?: string;
}
