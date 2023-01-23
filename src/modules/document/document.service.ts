import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import type { DocumentDto } from './dto/document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private docRepository: Repository<DocumentEntity>,
  ) {}

  @Transactional()
  async create(
    ownerId: Uuid,
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentEntity> {
    const doc = this.docRepository.create({
      ownerId,
      ...createDocumentDto,
    });
    await this.docRepository.save(doc);

    return doc;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<DocumentDto>> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .leftJoin('doc.owner', 'owner')
      .addSelect([
        'owner.id',
        'owner.firstName',
        'owner.lastName',
        'owner.matricNo',
        'owner.role',
        'owner.email',
        'owner.departmentId',
      ])
      .leftJoinAndSelect('doc.currentlyAssigned', 'currentlyAssigned')
      .addSelect([
        'currentlyAssigned.id',
        'currentlyAssigned.firstName',
        'currentlyAssigned.lastName',
      ])
      .leftJoinAndSelect('doc.workflow', 'workflow')
      .addSelect(['workflow.id', 'workflow.name']);
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id })
      .leftJoin('doc.owner', 'owner')
      .addSelect([
        'owner.id',
        'owner.firstName',
        'owner.lastName',
        'owner.matricNo',
        'owner.role',
        'owner.email',
        'owner.departmentId',
      ])
      .leftJoinAndSelect('doc.currentlyAssigned', 'currentlyAssigned')
      .addSelect([
        'currentlyAssigned.id',
        'currentlyAssigned.firstName',
        'currentlyAssigned.lastName',
      ])
      .leftJoinAndSelect('doc.workflow', 'workflow')
      .addSelect(['workflow.id', 'workflow.name']);

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    return docEntity;
  }

  async update(
    id: Uuid,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update({ id }, updateDocumentDto);

    return docEntity;
  }

  async remove(id: Uuid) {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.remove(docEntity);

    return docEntity;
  }
}
