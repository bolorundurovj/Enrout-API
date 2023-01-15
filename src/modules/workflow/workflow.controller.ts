import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { UUIDParam } from '../../decorators';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import type { WorkflowDto } from './dto/workflow.dto';
import { WorkflowService } from './workflow.service';

@Controller('workflows')
@ApiTags('Workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  async create(@Body() createWorkflowDto: CreateWorkflowDto) {
    const workflowEntity = await this.workflowService.create(createWorkflowDto);

    return workflowEntity.toDto();
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<WorkflowDto>> {
    return this.workflowService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@UUIDParam('id') id: Uuid): Promise<WorkflowDto> {
    const workflowEntity = await this.workflowService.findOne(id);

    return workflowEntity.toDto();
  }

  @Patch(':id')
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<WorkflowDto> {
    const workflowEntity = await this.workflowService.update(
      id,
      updateWorkflowDto,
    );

    return workflowEntity.toDto();
  }

  @Delete(':id')
  async remove(@UUIDParam('id') id: Uuid): Promise<WorkflowDto> {
    const workflowEntity = await this.workflowService.remove(id);

    return workflowEntity.toDto();
  }
}
