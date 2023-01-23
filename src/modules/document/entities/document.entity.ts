import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { DocumentState } from '../../../constants';
import { UseDto } from '../../../decorators';
import type { IStaffEntity } from '../../staff/entities/staff.entity';
import { StaffEntity } from '../../staff/entities/staff.entity';
import type { IStudentEntity } from '../../student/entities/student.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import type { IWorkflowEntity } from '../../workflow/entities/workflow.entity';
import { WorkflowEntity } from '../../workflow/entities/workflow.entity';
import { DocumentDto } from '../dto/document.dto';

export interface IDocumentEntity extends IAbstractEntity<DocumentDto> {
  title: string;
  description: string;
  state: DocumentState;
  owner: IStaffEntity | IStudentEntity;
  handlers: string[];
  currentlyAssigned?: IStaffEntity;
  attachment: string;
  workflow: IWorkflowEntity;
}

@Entity({ name: 'documents' })
@UseDto(DocumentDto)
export class DocumentEntity extends AbstractEntity<DocumentDto> {
  @Column({ type: 'uuid', nullable: false })
  ownerId: Uuid;

  @Column({ type: 'uuid', nullable: true })
  currentlyAssignedId: Uuid;

  @Column({ type: 'uuid', nullable: true })
  workflowId: Uuid;

  @Column({
    type: 'enum',
    enum: DocumentState,
    nullable: false,
    default: DocumentState.DRAFT,
  })
  state: DocumentState;

  @Column('jsonb', { array: true, default: [] })
  handlers: string[];

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToOne(() => WorkflowEntity)
  @JoinColumn()
  workflow: WorkflowEntity;

  @OneToOne(() => StudentEntity)
  @JoinColumn()
  owner: StudentEntity;

  @OneToOne(() => StaffEntity)
  @JoinColumn()
  currentlyAssigned: StaffEntity;
}
