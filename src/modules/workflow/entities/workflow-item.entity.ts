import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { GroupEntity } from '../../group/entities/group.entity';
import type { WorkflowItemDtoOptions } from '../dto/workflow-item.dto';
import { WorkflowItemDto } from '../dto/workflow-item.dto';
import { WorkflowEntity } from './workflow.entity';

export interface IWorkflowEntity extends IAbstractEntity<WorkflowItemDto> {
  name: string;
  position: number;
}

@Entity({ name: 'workflow_items' })
@UseDto(WorkflowItemDto)
export class WorkflowItemEntity
  extends AbstractEntity<WorkflowItemDto, WorkflowItemDtoOptions>
  implements IWorkflowEntity
{
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  position: number;

  @Column({ type: 'uuid', nullable: false })
  workflowId: Uuid;

  @Column({ type: 'uuid', nullable: false })
  groupId: Uuid;

  @OneToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @ManyToOne(
    () => WorkflowEntity,
    (workflowEntity) => workflowEntity.workflowItems,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowEntity;
}
