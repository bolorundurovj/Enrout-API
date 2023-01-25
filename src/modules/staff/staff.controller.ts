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
import { CreateStaffDto } from './dto/create-staff.dto';
import type { StaffDto } from './dto/staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffService } from './staff.service';

@Controller('staff')
@ApiTags('Staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(@Body() createStaffDto: CreateStaffDto) {
    const staffEntity = await this.staffService.create(createStaffDto);

    return staffEntity.toDto({ isActive: true });
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StaffDto>> {
    return this.staffService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@UUIDParam('id') id: Uuid): Promise<StaffDto> {
    const staffEntity = await this.staffService.findById(id);

    return staffEntity.toDto({ isActive: true });
  }

  @Patch(':id')
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateStaffDto: UpdateStaffDto,
  ): Promise<StaffDto> {
    const staffEntity = await this.staffService.update(id, updateStaffDto);

    return staffEntity.toDto({ isActive: true });
  }

  @Delete(':id')
  async remove(@UUIDParam('id') id: Uuid): Promise<StaffDto> {
    const staffEntity = await this.staffService.remove(id);

    return staffEntity.toDto({ isActive: true });
  }
}
