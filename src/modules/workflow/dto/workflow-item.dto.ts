import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { WorkflowItemEntity } from '../entities/workflow-item.entity';

export type WorkflowItemDtoOptions = Partial<{ isActive: boolean }>;

export class WorkflowItemDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  position: number;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(workflow: WorkflowItemEntity, options?: WorkflowItemDtoOptions) {
    super(workflow);
    this.name = workflow.name;
    this.position = workflow.position;
    this.isActive = options?.isActive;
  }
}
