import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import type { GroupRoleDto } from './dto/group-role.dto';
import type { UpdateGroupRoleDto } from './dto/update-group-role.dto';
import { GroupRoleEntity } from './entities/group-role.entity';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRoleEntity)
    private roleRepository: Repository<GroupRoleEntity>,
  ) {}

  @Transactional()
  async create(createGroupRoleDto: CreateGroupRoleDto) {
    const group = this.roleRepository.create(createGroupRoleDto);
    await this.roleRepository.save(group);

    return group;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<GroupRoleDto>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('group_role');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<GroupRoleEntity> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('group_role')
      .where('group_role.id = :id', { id });

    const groupEntity = await queryBuilder.getOne();

    if (!groupEntity) {
      throw new NotFoundException();
    }

    return groupEntity;
  }

  async update(
    id: Uuid,
    updateGroupRoleDto: UpdateGroupRoleDto,
  ): Promise<GroupRoleEntity> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('group_role')
      .where('group_role.id = :id', { id });

    const groupEntity = await queryBuilder.getOne();

    if (!groupEntity) {
      throw new NotFoundException();
    }

    await this.roleRepository.update({ id }, updateGroupRoleDto);

    return groupEntity;
  }

  async remove(id: Uuid) {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('group_role')
      .where('group_role.id = :id', { id });

    const groupEntity = await queryBuilder.getOne();

    if (!groupEntity) {
      throw new NotFoundException();
    }

    await this.roleRepository.remove(groupEntity);

    return groupEntity;
  }
}
