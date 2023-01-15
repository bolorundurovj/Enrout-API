import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { StudentRoleType } from '../../../constants';
import { UseDto, VirtualColumn } from '../../../decorators';
import type { IDepartmentEntity } from '../../department/entities/department.entity';
import { DepartmentEntity } from '../../department/entities/department.entity';
import type { StudentDtoOptions } from '../dto/student.dto';
import { StudentDto } from '../dto/student.dto';

export interface IStudentEntity extends IAbstractEntity<StudentDto> {
  firstName: string;

  lastName: string;

  role: StudentRoleType;

  email: string;

  password: string;

  phone?: string;

  avatar?: string;

  fullName?: string;

  matricNo: string;

  department: IDepartmentEntity;

  token?: string;

  tokenExpiry?: Date;
}

@Entity({ name: 'students' })
@UseDto(StudentDto)
export class StudentEntity
  extends AbstractEntity<StudentDto, StudentDtoOptions>
  implements IStudentEntity
{
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({
    type: 'enum',
    enum: StudentRoleType,
    default: StudentRoleType.UNDERGRADUATE,
  })
  role: StudentRoleType;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  matricNo: string;

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

  @ManyToOne(() => DepartmentEntity, (deptEntity) => deptEntity.students, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @VirtualColumn()
  fullName?: string;
}
