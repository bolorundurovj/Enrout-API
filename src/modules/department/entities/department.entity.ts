import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { GroupEntity } from '../../group/entities/group.entity';
import { DepartmentDto } from '../dto/department.dto';

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
