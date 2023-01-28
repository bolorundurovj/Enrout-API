import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { GroupRoleEntity } from '../../group-role/entities/group-role.entity';
import type { WorkflowItemDtoOptions } from '../dto/workflow-item.dto';
import { WorkflowItemDto } from '../dto/workflow-item.dto';
import { WorkflowEntity } from './workflow.entity';

export interface IWorkflowItemEntity extends IAbstractEntity<WorkflowItemDto> {
  name: string;
  position: number;
}

@Entity({ name: 'workflow_items' })
@UseDto(WorkflowItemDto)
export class WorkflowItemEntity
  extends AbstractEntity<WorkflowItemDto, WorkflowItemDtoOptions>
  implements IWorkflowItemEntity
{
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'int', generated: 'increment' })
  position: number;

  @Column({ type: 'uuid', nullable: false })
  workflowId: Uuid;

  @Column({ type: 'uuid', nullable: false })
  groupRoleId: Uuid;

  @ManyToOne(() => GroupRoleEntity)
  @JoinColumn({ name: 'group_role_id' })
  groupRole: GroupRoleEntity;

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
