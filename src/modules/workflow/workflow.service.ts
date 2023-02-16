import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { CreateWorkflowItemDto } from './dto/create-workflow-item.dto';
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
  /**
   * It creates a new workflow using the data transfer object (DTO) and saves it to the database
   * @param {CreateWorkflowDto} createWorkflowDto - CreateWorkflowDto
   * @returns The workflow object
   */
  async create(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    await this.workflowRepository.save(workflow);

    return workflow;
  }

  @Transactional()
  /**
   * It creates a new workflow item and saves it to the database
   * @param {Uuid} workflowId - Uuid - This is the id of the workflow that the workflow item will be associated with.
   * @param {CreateWorkflowItemDto} createWorkflowItemDto - CreateWorkflowItemDto
   * @returns The workflowItem
   */
  async createWorkflowItem(
    workflowId: Uuid,
    createWorkflowItemDto: CreateWorkflowItemDto,
  ) {
    const workflowItem = this.workflowItemRepository.create({
      ...createWorkflowItemDto,
      workflowId,
    });
    await this.workflowItemRepository.save(workflowItem);

    return workflowItem;
  }

  /**
   * It takes a PageOptionsDto object, creates a query builder, paginates the query, and returns a PageDto object
   * @param {PageOptionsDto} pageOptionsDto - This is a class that contains the page number and the page size.
   * @returns A PageDto<WorkflowDto>
   */
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<WorkflowDto>> {
    const queryBuilder = this.workflowRepository.createQueryBuilder('workflow');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  /**
   * It finds a workflow by id, and returns it with its workflow items and group roles
   * @param {Uuid} id - Uuid - The id of the workflow we want to find
   * @returns A workflow entity with its workflow items and group roles.
   */
  async findOne(id: Uuid): Promise<WorkflowEntity> {
    const queryBuilder = this.workflowRepository
      .createQueryBuilder('workflow')
      .leftJoinAndSelect('workflow.workflowItems', 'workflowItems')
      .leftJoinAndSelect('workflowItems.groupRole', 'groupRole')
      .where('workflow.id = :id', { id })
      .orderBy('workflowItems.position', 'ASC');

    const workflowEntity = await queryBuilder.getOne();

    if (!workflowEntity) {
      throw new NotFoundException();
    }

    return workflowEntity;
  }

  /**
   * It updates a workflow entity in the database
   * @param {Uuid} id - Uuid - The id of the workflow we want to update.
   * @param {UpdateWorkflowDto} updateWorkflowDto - UpdateWorkflowDto
   * @returns The updated workflow entity.
   */
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

  /**
   * It removes a workflow from the database
   * @param {Uuid} id - Uuid - The id of the workflow to be deleted
   * @returns The workflowEntity is being returned.
   */
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

  /**
   * It removes a workflow item from the database
   * @param {Uuid} id - Uuid - The id of the workflow item to be deleted
   * @returns The workflowItemEntity
   */
  async removeWorkflowItem(id: Uuid) {
    const queryBuilder = this.workflowItemRepository
      .createQueryBuilder('workflowItem')
      .where('workflowItem.id = :id', { id });

    const workflowItemEntity = await queryBuilder.getOne();

    if (!workflowItemEntity) {
      throw new NotFoundException();
    }

    await this.workflowItemRepository.remove(workflowItemEntity);

    return workflowItemEntity;
  }

  /**
   * It returns the number of workflows in the database
   * @returns The number of workflows in the database.
   */
  async getCount(): Promise<number> {
    const queryBuilder = this.workflowRepository.createQueryBuilder('workflow');

    return queryBuilder.getCount();
  }
}
