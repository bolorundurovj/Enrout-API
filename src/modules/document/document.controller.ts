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
import type { StaffEntity } from '../staff/entities/staff.entity';
import type { StudentEntity } from '../student/entities/student.entity';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import type { DocumentDto } from './dto/document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
@ApiTags('Documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: StudentEntity | StaffEntity,
  ) {
    const docEntity = await this.documentService.create(
      user.id,
      createDocumentDto,
    );

    return docEntity.toDto();
  }

  @Get()
  @Auth([RoleType.ADMIN])
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentDto>> {
    return this.documentService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.ADMIN])
  async findOne(@UUIDParam('id') id: Uuid): Promise<DocumentDto> {
    const docEntity = await this.documentService.findOne(id);

    return docEntity.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentDto> {
    const docEntity = await this.documentService.update(id, updateDocumentDto);

    return docEntity.toDto();
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  async remove(@UUIDParam('id') id: Uuid): Promise<DocumentDto> {
    const docEntity = await this.documentService.remove(id);

    return docEntity.toDto();
  }
}
