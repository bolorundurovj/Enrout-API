import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class StudentUpdateDocumentDto {
  @ApiPropertyOptional()
  @IsString()
  @Trim()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  description?: string;
}
