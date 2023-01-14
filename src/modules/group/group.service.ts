import { Injectable } from '@nestjs/common';

import type { CreateGroupDto } from './dto/create-group.dto';
import type { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  create(createGroupDto: CreateGroupDto) {
    return createGroupDto;
  }

  findAll() {
    return `This action returns all group`;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
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
