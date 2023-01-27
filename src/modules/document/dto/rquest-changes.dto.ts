import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class RequestChangesDto {
  @ApiProperty()
  @IsString()
  @Trim()
  comment: string;
}
