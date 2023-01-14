import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import type { GroupDto } from './dto/group.dto';
import type { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}

  @Transactional()
  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
    const group = this.groupRepository.create(createGroupDto);
    await this.groupRepository.save(group);

    return group;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    const queryBuilder = this.groupRepository.createQueryBuilder('group');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<GroupEntity> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :id', { id });

    const groupEntity = await queryBuilder.getOne();

    if (!groupEntity) {
      throw new NotFoundException();
    }

    return groupEntity;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return {
      id,
      group: updateGroupDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
