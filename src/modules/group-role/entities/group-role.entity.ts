import { Column, Entity, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { StaffDesignation } from '../../../constants';
import { UseDto } from '../../../decorators';
import { WorkflowItemEntity } from '../../workflow/entities/workflow-item.entity';
import type { GroupRoleDtoOptions } from '../dto/group-role.dto';
import { GroupRoleDto } from '../dto/group-role.dto';

export interface IGroupRoleEntity extends IAbstractEntity<GroupRoleDto> {
  name: string;

  designation: StaffDesignation;
}

@Entity({ name: 'group_roles' })
@UseDto(GroupRoleDto)
export class GroupRoleEntity
  extends AbstractEntity<GroupRoleDto, GroupRoleDtoOptions>
  implements IGroupRoleEntity
{
  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: StaffDesignation,
    nullable: false,
  })
  designation: StaffDesignation;

  @OneToMany(() => WorkflowItemEntity, (itemEntity) => itemEntity.groupRole)
  workflowItems: WorkflowItemEntity[];
}
