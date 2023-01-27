import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DocumentState } from '../../../constants';
import { StaffEntity } from '../../staff/entities/staff.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import { WorkflowEntity } from '../../workflow/entities/workflow.entity';
import type { DocumentEntity } from '../entities/document.entity';

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
  currentlyAssignedId?: string;

  @ApiPropertyOptional()
  workflow?: WorkflowEntity;

  @ApiPropertyOptional()
  reviewerAttachment?: string;

  @ApiPropertyOptional()
  reviewerComment?: string;

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
    this.currentlyAssignedId = doc.currentlyAssignedId;
    this.handlers = doc.handlers;
    this.reviewerAttachment = doc.reviewerAttachment;
    this.reviewerComment = doc.reviewerComment;
  }
}
