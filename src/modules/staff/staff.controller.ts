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
import type { DocumentDto } from '../document/dto/document.dto';
import { UpdateDocumentDto } from '../document/dto/update-document.dto';
import { StudentEntity } from '../student/entities/student.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ForwardDocumentDto } from './dto/forward-document.dto';
import type { StaffDto } from './dto/staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import type { StaffEntity } from './entities/staff.entity';
import { StaffService } from './staff.service';

@Controller('staff')
@ApiTags('Staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly documentService: DocumentService,
  ) {}

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

  @Get('/documents')
  @Auth([RoleType.STAFF])
  async findAllDocs(
    @Query() pageOptionsDto: PageOptionsDto,
    @AuthUser() user: StudentEntity,
  ): Promise<PageDto<DocumentDto>> {
    return this.documentService.findStaffAssignedDocs(user.id, pageOptionsDto);
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

  @Get('/documents/:id')
  async findOneDoc(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.staffFindOne(user.id, id);

    return docEntity.toDto();
  }

  @Patch('documents/:id')
  async updateDOc(
    @UUIDParam('id') id: Uuid,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.updateStaffAssignedDoc(
      user.id,
      id,
      updateDocumentDto,
    );

    return docEntity.toDto();
  }

  @Patch('documents/:id/forward')
  async forwardDoc(
    @UUIDParam('id') id: Uuid,
    @Body() body: ForwardDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.forwardDocument(
      user.id,
      body.staffId,
      id,
    );

    return docEntity.toDto();
  }

  @Patch('documents/:id/reject')
  async rejectDoc(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: StudentEntity | StaffEntity,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.rejectDocument(user.id, id);

    return docEntity.toDto();
  }
}
