import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { WorkflowItemEntity } from '../entities/workflow-item.entity';

export type WorkflowItemDtoOptions = Partial<{ isActive: boolean }>;

export class WorkflowItemDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  workflowId: string;

  @ApiProperty()
  groupRoleId: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(workflow: WorkflowItemEntity, options?: WorkflowItemDtoOptions) {
    super(workflow);
    this.name = workflow.name;
    this.position = workflow.position;
    this.workflowId = workflow.workflowId;
    this.groupRoleId = workflow.groupRoleId;
    this.isActive = options?.isActive;
  }
}
