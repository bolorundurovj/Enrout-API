import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { StaffDesignation } from '../../../constants';
import { Trim } from '../../../decorators';

export class CreateGroupRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty({ enum: StaffDesignation })
  @IsNotEmpty()
  @Trim()
  designation: StaffDesignation;
}
