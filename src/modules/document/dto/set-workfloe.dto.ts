import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { Trim } from '../../../decorators';

export class SetWorkflowDto {
  @ApiProperty()
  @IsUUID()
  @Trim()
  workflowId: string;
}
