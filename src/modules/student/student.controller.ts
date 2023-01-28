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
import { MailService } from '../../mail/mail.service';
import { DocumentService } from '../document/document.service';
import { CreateDocumentDto } from '../document/dto/create-document.dto';
import type { DocumentDto } from '../document/dto/document.dto';
import { StudentUpdateDocumentDto } from '../document/dto/student-update-document.dto';
import type { StaffEntity } from '../staff/entities/staff.entity';
import { StaffService } from '../staff/staff.service';
import { CreateStudentDto } from './dto/create-student.dto';
import type { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import type { StudentEntity } from './entities/student.entity';
import { StudentService } from './student.service';

@Controller('students')
@ApiTags('Students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly documentService: DocumentService,
    private readonly mailService: MailService,
    private readonly staffService: StaffService,
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

  @Get('documents')
  @Auth([RoleType.STUDENT])
  async findAllStudentDocs(
    @Query() pageOptionsDto: PageOptionsDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<PageDto<DocumentDto>> {
    return this.documentService.findAllStudentDocs(user.id, pageOptionsDto);
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

  @Get('documents/:id')
  @Auth([RoleType.STUDENT])
  async findOneDoc(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.studentFindOne(user.id, id);

    return docEntity.toDto();
  }

  @Patch('documents/:id')
  @Auth([RoleType.STUDENT])
  async updateDOc(
    @UUIDParam('id') id: Uuid,
    @Body() updateDocumentDto: StudentUpdateDocumentDto,
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
  @Auth([RoleType.STUDENT])
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
  @Auth([RoleType.STUDENT])
  async forwardDoc(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.publishDocument(
      user.id,
      user.departmentId,
      id,
    );

    const staffEntity = await this.staffService.findById(
      docEntity.currentlyAssignedId,
    );

    await this.mailService.forwardedDocument({
      to: staffEntity.email,
      data: {
        name: `${user.firstName} ${user.lastName}`,
        docTitle: docEntity.title,
      },
    });

    return docEntity.toDto();
  }

  @Patch('documents/:id/nudge')
  @Auth([RoleType.STUDENT])
  async nudgeReviewer(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.studentFindOne(user.id, id);

    const staffEntity = await this.staffService.findById(
      docEntity.currentlyAssignedId,
    );

    await this.mailService.sendNudge({
      to: staffEntity.email,
      data: {
        name: `${user.firstName} ${user.lastName}`,
        docTitle: docEntity.title,
      },
    });

    return docEntity.toDto();
  }

  @Patch('documents/:id/resolve')
  @Auth([RoleType.STUDENT])
  async resolveDocument(
    @UUIDParam('id') id: Uuid,
    @Body() updateDocumentDto: StudentUpdateDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.studentResolveDoc(
      user.id,
      id,
      updateDocumentDto,
    );

    const staffEntity = await this.staffService.findById(
      docEntity.currentlyAssignedId,
    );

    await this.mailService.returnedDocMail({
      to: staffEntity.email,
      data: {
        docTitle: docEntity.title,
      },
    });

    return docEntity.toDto();
  }
}
