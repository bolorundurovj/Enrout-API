import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { DivisionType } from '../../../constants';
import { Trim } from '../../../decorators';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  name: string;

  @ApiProperty({ enum: DivisionType })
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  division?: DivisionType;
}
