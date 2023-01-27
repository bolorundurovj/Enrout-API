import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class ForwardDocumentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly comment: string = '';
}
