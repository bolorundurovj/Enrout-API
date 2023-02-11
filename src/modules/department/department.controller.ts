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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import type { DepartmentDto } from './dto/department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
@ApiTags('Departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const deptEntity = await this.departmentService.create(createDepartmentDto);

    return deptEntity.toDto();
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DepartmentDto>> {
    return this.departmentService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth()
  async findOne(@UUIDParam('id') id: Uuid): Promise<DepartmentDto> {
    const deptEntity = await this.departmentService.findOne(id);

    return deptEntity.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentDto> {
    const deptEntity = await this.departmentService.update(
      id,
      updateDepartmentDto,
    );

    return deptEntity.toDto();
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  async remove(@UUIDParam('id') id: Uuid): Promise<DepartmentDto> {
    const deptEntity = await this.departmentService.remove(id);

    return deptEntity.toDto();
  }
}
