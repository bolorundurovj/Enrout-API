import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { Trim } from '../../../decorators';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Trim()
  groupId: Uuid;
}
