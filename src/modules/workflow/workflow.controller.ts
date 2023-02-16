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
import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { CreateWorkflowItemDto } from './dto/create-workflow-item.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import type { WorkflowDto } from './dto/workflow.dto';
import type { WorkflowItemDto } from './dto/workflow-item.dto';
import { WorkflowService } from './workflow.service';

@Controller('workflows')
@ApiTags('Workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  async create(@Body() createWorkflowDto: CreateWorkflowDto) {
    const workflowEntity = await this.workflowService.create(createWorkflowDto);

    return workflowEntity.toDto();
  }

  @Post(':id/items')
  @Auth([RoleType.ADMIN])
  async createWorkflowItem(
    @UUIDParam('id') id: Uuid,
    @Body() createWorkflowItemDto: CreateWorkflowItemDto,
  ) {
    const workflowItemEntity = await this.workflowService.createWorkflowItem(
      id,
      createWorkflowItemDto,
    );

    return workflowItemEntity.toDto();
  }

  @Get()
  @Auth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<WorkflowDto>> {
    return this.workflowService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth()
  async findOne(@UUIDParam('id') id: Uuid): Promise<WorkflowDto> {
    return this.workflowService.findOne(id);
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN])
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
  @Auth([RoleType.ADMIN])
  async remove(@UUIDParam('id') id: Uuid): Promise<WorkflowDto> {
    const workflowEntity = await this.workflowService.remove(id);

    return workflowEntity.toDto();
  }

  @Delete(':id/items')
  @Auth([RoleType.ADMIN])
  async removeItem(@UUIDParam('id') id: Uuid): Promise<WorkflowItemDto> {
    const workflowItemEntity = await this.workflowService.removeWorkflowItem(
      id,
    );

    return workflowItemEntity.toDto();
  }
}
