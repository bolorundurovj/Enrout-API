import { Column, Entity, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import type { WorkflowDtoOptions } from '../dto/workflow.dto';
import { WorkflowDto } from '../dto/workflow.dto';
import { WorkflowItemEntity } from './workflow-item.entity';

// import {WorkflowGroupDto} from "../dto/workflow-group.dto";

export interface IWorkflowEntity extends IAbstractEntity<WorkflowDto> {
  name: string;
}

@Entity({ name: 'workflows' })
@UseDto(WorkflowDto)
export class WorkflowEntity
  extends AbstractEntity<WorkflowDto, WorkflowDtoOptions>
  implements IWorkflowEntity
{
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => WorkflowItemEntity, (itemEntity) => itemEntity.workflow)
  workflowItems: WorkflowItemEntity[];

  // @Column("jsonb", {array: true, default: []})
  // path: Array<WorkflowGroupDto>
}
