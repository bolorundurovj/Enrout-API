import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { WorkflowEntity } from '../entities/workflow.entity';

export type WorkflowDtoOptions = Partial<{ isActive: boolean }>;

export class WorkflowDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(workflow: WorkflowEntity, options?: WorkflowDtoOptions) {
    super(workflow);
    this.name = workflow.name;
    this.isActive = options?.isActive;
  }
}
