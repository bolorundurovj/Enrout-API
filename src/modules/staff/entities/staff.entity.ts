import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { StaffDesignation } from '../../../constants';
import { UseDto, VirtualColumn } from '../../../decorators';
import type { IDepartmentEntity } from '../../department/entities/department.entity';
import { DepartmentEntity } from '../../department/entities/department.entity';
import type { StaffDtoOptions } from '../dto/staff.dto';
import { StaffDto } from '../dto/staff.dto';

export interface IStaffEntity extends IAbstractEntity<StaffDto> {
  firstName: string;

  lastName: string;

  designation: StaffDesignation;

  email: string;

  password: string;

  phone?: string;

  avatar?: string;

  fullName?: string;

  staffId: string;

  department: IDepartmentEntity;

  token?: string;

  tokenExpiry?: Date;
}

@Entity({ name: 'staff' })
@UseDto(StaffDto)
export class StaffEntity
  extends AbstractEntity<StaffDto, StaffDtoOptions>
  implements IStaffEntity
{
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({
    type: 'enum',
    enum: StaffDesignation,
    default: StaffDesignation.Lecturer,
  })
  designation: StaffDesignation;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  staffId: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  tokenExpiry?: Date;

  @Column({ type: 'uuid', nullable: false })
  departmentId: Uuid;

  @ManyToOne(() => DepartmentEntity, (deptEntity) => deptEntity.staff, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @VirtualColumn()
  fullName?: string;
}
