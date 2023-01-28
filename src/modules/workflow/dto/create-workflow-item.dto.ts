import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { Trim } from '../../../decorators';

export class CreateWorkflowItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Trim()
  groupRoleId: Uuid;
}
