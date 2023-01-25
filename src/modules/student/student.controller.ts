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
import { CreateStudentDto } from './dto/create-student.dto';
import type { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@Controller('students')
@ApiTags('Students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const studentEntity = await this.studentService.create(createStudentDto);

    return studentEntity.toDto({ isActive: true });
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StudentDto>> {
    return this.studentService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@UUIDParam('id') id: Uuid): Promise<StudentDto> {
    const studentEntity = await this.studentService.findById(id);

    return studentEntity.toDto();
  }

  @Patch(':id')
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    const studentEntity = await this.studentService.update(
      id,
      updateStudentDto,
    );

    return studentEntity.toDto();
  }

  @Delete(':id')
  async remove(@UUIDParam('id') id: Uuid): Promise<StudentDto> {
    const studentEntity = await this.studentService.remove(id);

    return studentEntity.toDto();
  }
}
