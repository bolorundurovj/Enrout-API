import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import type { DepartmentDto } from './dto/department.dto';
import type { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private deptRepository: Repository<DepartmentEntity>,
  ) {}

  @Transactional()
  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    const dept = this.deptRepository.create(createDepartmentDto);
    await this.deptRepository.save(dept);

    return dept;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DepartmentDto>> {
    const queryBuilder = this.deptRepository.createQueryBuilder('dept');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<DepartmentEntity> {
    const queryBuilder = this.deptRepository
      .createQueryBuilder('dept')
      .where('dept.id = :id', { id });

    const deptEntity = await queryBuilder.getOne();

    if (!deptEntity) {
      throw new NotFoundException();
    }

    return deptEntity;
  }

  async update(
    id: Uuid,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentEntity> {
    const queryBuilder = this.deptRepository
      .createQueryBuilder('dept')
      .where('dept.id = :id', { id });

    const deptEntity = await queryBuilder.getOne();

    if (!deptEntity) {
      throw new NotFoundException();
    }

    await this.deptRepository.update({ id }, updateDepartmentDto);

    return deptEntity;
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
