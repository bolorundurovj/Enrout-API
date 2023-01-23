import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DocumentState } from '../../../constants';
import type { DocumentEntity } from '../entities/document.entity';
import {WorkflowEntity} from "../../workflow/entities/workflow.entity";
import {StaffEntity} from "../../staff/entities/staff.entity";
import {StudentEntity} from "../../student/entities/student.entity";

export class DocumentDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  owner: StudentEntity;

  @ApiProperty({ enum: DocumentState })
  state: DocumentState;

  @ApiProperty()
  handlers: string[];

  @ApiPropertyOptional()
  currentlyAssigned?: StaffEntity;

  @ApiPropertyOptional()
  attachment?: string;

  @ApiPropertyOptional()
  workflowId?: string;

  @ApiPropertyOptional()
  workflow?: WorkflowEntity;

  constructor(doc: DocumentEntity) {
    super(doc);
    this.id = doc.id;
    this.state = doc.state;
    this.title = doc.title;
    this.description = doc.description;
    this.attachment = doc.attachment;
    this.owner = doc.owner;
    this.workflow = doc.workflow;
    this.currentlyAssigned = doc.currentlyAssigned;
    this.handlers = doc.handlers;
  }
}
