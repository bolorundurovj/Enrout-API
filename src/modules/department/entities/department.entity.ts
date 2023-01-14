import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import type { IGroupEntity } from '../../group/entities/group.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { DepartmentDto } from '../dto/department.dto';

export interface IDepartmentEntity extends IAbstractEntity<DepartmentDto> {
  name: string;
  group: IGroupEntity;
}

@Entity({ name: 'departments' })
@UseDto(DepartmentDto)
export class DepartmentEntity extends AbstractEntity<DepartmentDto> {
  @Column({ type: 'uuid', nullable: false })
  groupId: Uuid;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => GroupEntity, (groupEntity) => groupEntity.departments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
