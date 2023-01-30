import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { DivisionType } from '../../../constants';
import { Trim } from '../../../decorators';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty({ enum: DivisionType })
  @IsOptional()
  @Trim()
  division?: DivisionType;
}
