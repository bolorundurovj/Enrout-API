import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(Number(id));
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
