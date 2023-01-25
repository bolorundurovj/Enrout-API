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
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { DocumentService } from '../document/document.service';
import { CreateDocumentDto } from '../document/dto/create-document.dto';
import type { DocumentDto } from '../document/dto/document.dto';
import { UpdateDocumentDto } from '../document/dto/update-document.dto';
import type { StaffEntity } from '../staff/entities/staff.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import type { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';
import { StudentService } from './student.service';
import {ForwardDocumentDto} from "../staff/dto/forward-document.dto";

@Controller('students')
@ApiTags('Students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly documentService: DocumentService,
  ) {}

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

  @Post('documents')
  @Auth([RoleType.STUDENT])
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ) {
    const docEntity = await this.documentService.create(
      user.id,
      createDocumentDto,
    );

    return docEntity.toDto();
  }

  @Get('/documents')
  async findAllDocs(
    @Query() pageOptionsDto: PageOptionsDto,
    @AuthUser() user: StudentEntity,
  ): Promise<PageDto<DocumentDto>> {
    return this.documentService.findAllStudentDocs(user.id, pageOptionsDto);
  }

  @Get('/documents/:id')
  async findOneDoc(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.studentFindOne(user.id, id);

    return docEntity.toDto();
  }

  @Patch('documents/:id')
  async updateDOc(
    @UUIDParam('id') id: Uuid,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.studentUpdateDoc(
      user.id,
      id,
      updateDocumentDto,
    );

    return docEntity.toDto();
  }

  @Delete('documents/:id')
  async removeDoc(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.studentDeleteDocument(
      user.id,
      id,
    );

    return docEntity.toDto();
  }

  @Patch('documents/:id/publish')
  async forwardDoc(
    @UUIDParam('id') id: Uuid,
    @Body() body: ForwardDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.publishDocument(
      user.id,
      body.staffId,
      id,
    );

    return docEntity.toDto();
  }
}
