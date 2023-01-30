import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class RejectDocumentDto {
  @ApiProperty()
  @IsString()
  @Trim()
  comment: string;
}
