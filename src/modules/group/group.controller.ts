import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UUIDParam } from '../../decorators';
import { CreateGroupDto } from './dto/create-group.dto';
import type { GroupDto } from './dto/group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@Controller('groups')
@ApiTags('Groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    const groupEntity = await this.groupService.create(createGroupDto);

    return groupEntity.toDto();
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findOne(@UUIDParam('id') id: Uuid): Promise<GroupDto> {
    const groupEntity = await this.groupService.findOne(id);

    return groupEntity.toDto();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(Number(id), updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(Number(id));
  }
}
