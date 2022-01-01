import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import type { UpdateWorkflowDto } from './dto/update-workflow.dto';
import type { WorkflowDto } from './dto/workflow.dto';
import { WorkflowEntity } from './entities/workflow.entity';
import { WorkflowItemEntity } from './entities/workflow-item.entity';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowEntity)
    private workflowRepository: Repository<WorkflowEntity>,
    @InjectRepository(WorkflowItemEntity)
    private workflowItemRepository: Repository<WorkflowItemEntity>,
  ) {}

  @Transactional()
  async create(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    await this.workflowRepository.save(workflow);

    return workflow;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<WorkflowDto>> {
    const queryBuilder = this.workflowRepository.createQueryBuilder('workflow');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<WorkflowEntity> {
    const queryBuilder = this.workflowRepository
      .createQueryBuilder('workflow')
      .where('workflow.id = :id', { id });

    const workflowEntity = await queryBuilder.getOne();

    if (!workflowEntity) {
      throw new NotFoundException();
    }

    return workflowEntity;
  }

  async update(
    id: Uuid,
    updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<WorkflowEntity> {
    const queryBuilder = this.workflowRepository
      .createQueryBuilder('workflow')
      .where('workflow.id = :id', { id });

    const workflowEntity = await queryBuilder.getOne();

    if (!workflowEntity) {
      throw new NotFoundException();
    }

    await this.workflowRepository.update({ id }, updateWorkflowDto);

    return workflowEntity;
  }

  async remove(id: Uuid) {
    const queryBuilder = this.workflowRepository
      .createQueryBuilder('workflow')
      .where('workflow.id = :id', { id });

    const workflowEntity = await queryBuilder.getOne();

    if (!workflowEntity) {
      throw new NotFoundException();
    }

    await this.workflowRepository.remove(workflowEntity);

    return workflowEntity;
  }
}
