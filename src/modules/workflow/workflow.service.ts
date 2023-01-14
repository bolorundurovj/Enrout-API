import { Injectable } from '@nestjs/common';

import type { CreateWorkflowDto } from './dto/create-workflow.dto';
import type { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowService {
  create(createWorkflowDto: CreateWorkflowDto) {
    return createWorkflowDto;
  }

  findAll() {
    return `This action returns all workflow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workflow`;
  }

  update(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    return {
      id,
      workflow: updateWorkflowDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} workflow`;
  }
}
