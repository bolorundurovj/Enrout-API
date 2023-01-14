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
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<GroupDto>> {
    return this.groupService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@UUIDParam('id') id: Uuid): Promise<GroupDto> {
    const groupEntity = await this.groupService.findOne(id);

    return groupEntity.toDto();
  }

  @Patch(':id')
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const groupEntity = await this.groupService.update(id, updateGroupDto);

    return groupEntity.toDto();
  }

  @Delete(':id')
  async remove(@UUIDParam('id') id: Uuid): Promise<GroupDto> {
    const groupEntity = await this.groupService.remove(id);

    return groupEntity.toDto();
  }
}
