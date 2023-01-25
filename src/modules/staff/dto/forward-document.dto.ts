import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class ForwardDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly staffId: Uuid;
}
