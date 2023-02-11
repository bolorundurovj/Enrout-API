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
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import type { GroupRoleDto } from './dto/group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';
import { GroupRoleService } from './group-role.service';

@Controller('group-roles')
@ApiTags('Group Roles')
export class GroupRoleController {
  constructor(private readonly groupRoleService: GroupRoleService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  async create(@Body() createGroupRoleDto: CreateGroupRoleDto) {
    const groupEntity = await this.groupRoleService.create(createGroupRoleDto);

    return groupEntity.toDto();
  }

  @Get()
  @Auth()
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<GroupRoleDto>> {
    return this.groupRoleService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth()
  async findOne(@UUIDParam('id') id: Uuid) {
    const entity = await this.groupRoleService.findOne(id);

    return entity.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateGroupRoleDto: UpdateGroupRoleDto,
  ) {
    const entity = await this.groupRoleService.update(id, updateGroupRoleDto);

    return entity.toDto();
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  async remove(@UUIDParam('id') id: Uuid): Promise<GroupRoleDto> {
    const entity = await this.groupRoleService.remove(id);

    return entity.toDto();
  }
}
