import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { WorkflowEntity } from '../entities/workflow.entity';
import type { IWorkflowItemEntity } from '../entities/workflow-item.entity';

export type WorkflowDtoOptions = Partial<{ isActive: boolean }>;

export class ExtendedWorkflowDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  workflowItems: IWorkflowItemEntity[];

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(workflow: WorkflowEntity, options?: WorkflowDtoOptions) {
    super(workflow);
    this.name = workflow.name;
    this.isActive = options?.isActive;
  }
}
