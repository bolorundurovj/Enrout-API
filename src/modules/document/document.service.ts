import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { DocumentState, StaffDesignation } from '../../constants';
import { StaffService } from '../staff/staff.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import type { DocumentDto } from './dto/document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private docRepository: Repository<DocumentEntity>,
    private staffService: StaffService,
  ) {}

  @Transactional()
  /**
   * It creates a new document and saves it to the database
   * @param {Uuid} ownerId - Uuid - The ownerId is the id of the user who created the document.
   * @param {CreateDocumentDto} createDocumentDto - CreateDocumentDto
   * @returns A promise of a DocumentEntity
   */
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

  /**
   * It returns a paginated list of documents, with their owners, currently assigned users and workflows
   * @param {PageOptionsDto} pageOptionsDto - This is the object that contains the page number and the page size.
   * @returns An array of items and a pageMetaDto
   */
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

  /**
   * It finds a document by its id, and returns the document with its owner, currentlyAssigned, and workflow
   * @param {Uuid} id - Uuid - The id of the document to be retrieved
   * @returns A document entity
   */
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

  /**
   * We're using the `createQueryBuilder` method to create a query builder object. We're then using the `where` method to
   * add a `where` clause to the query. We're then using the `getOne` method to execute the query and return the first
   * result
   * @param {Uuid} id - Uuid - The id of the document to update
   * @param {UpdateDocumentDto} updateDocumentDto - UpdateDocumentDto
   * @returns The updated document
   */
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

  /**
   * We're using the `createQueryBuilder` method to create a query builder object, which we can use to build a query. We're
   * using the `where` method to add a `where` clause to the query. We're using the `getOne` method to execute the query
   * and return the first result
   * @param {Uuid} id - Uuid - The id of the document to be deleted.
   * @returns The docEntity is being returned.
   */
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

  /**
   * "Reject a document by a user."
   *
   * The first thing we do is create a query builder. This is a special object that allows us to build a query to the
   * database. We use it to find the document that we want to reject
   * @param {Uuid} userId - Uuid - the user id of the user who is rejecting the document
   * @param {Uuid} docId - Uuid - The id of the document to be rejected
   * @returns DocumentEntity
   */
  async rejectDocument(userId: Uuid, docId: Uuid): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id: docId })
      .andWhere('doc.currentlyAssigned = :id', { id: userId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update(
      { id: docId },
      { state: DocumentState.REJECTED },
    );

    return docEntity;
  }

  /**
   * "Forward a document to another staff member."
   *
   * The function takes in three parameters:
   *
   * - userId: The ID of the user who is forwarding the document.
   * - staffId: The ID of the staff member to whom the document is being forwarded.
   * - docId: The ID of the document being forwarded
   * @param {Uuid} userId - The id of the user who is forwarding the document
   * @param {Uuid} staffId - The id of the staff member to whom the document is being forwarded.
   * @param {Uuid} docId - The id of the document to be forwarded
   * @returns DocumentEntity
   */
  async forwardDocument(
    userId: Uuid,
    staffId: Uuid,
    docId: Uuid,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id: docId })
      .andWhere('doc.currentlyAssigned = :id', { id: userId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update(
      { id: docId },
      { currentlyAssignedId: staffId },
    );

    return docEntity;
  }

  /**
   * It deletes a document by setting the isDeleted flag to true
   * @param {Uuid} studentId - Uuid - the student's id
   * @param {Uuid} docId - Uuid - the id of the document to be deleted
   * @returns The document entity that was deleted.
   */
  async studentDeleteDocument(
    studentId: Uuid,
    docId: Uuid,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :did', { did: docId })
      .andWhere('doc.ownerId = :id', { id: studentId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update({ id: docId }, { isDeleted: true });

    return docEntity;
  }

  /**
   * It takes in a studentId, a staffId, and a docId, and returns a DocumentEntity
   * @param {Uuid} studentId - The id of the student who owns the document
   * @param departmentId
   * @param {Uuid} docId - Uuid - the id of the document that is being published
   * @returns DocumentEntity
   */
  async publishDocument(
    studentId: Uuid,
    departmentId: Uuid,
    docId: Uuid,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownerId = :sid', { sid: studentId })
      .andWhere('doc.id = :id', { id: docId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException('Document not found');
    }

    const staffEntity = await this.staffService.findOneByDeptAndRole(
      departmentId,
      StaffDesignation.HOD,
    );

    await this.docRepository.update(
      { id: docId },
      { currentlyAssignedId: staffEntity.id, state: DocumentState.PENDING },
    );

    docEntity.currentlyAssignedId = staffEntity.id;

    return docEntity;
  }

  /**
   * It returns a page of student documents for a given student id
   * @param {Uuid} id - Uuid - the id of the student
   * @param {PageOptionsDto} pageOptionsDto - This is a class that contains the page number and the page size.
   * @returns A page of student documents.
   */
  async findAllStudentDocs(
    id: Uuid,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentDto>> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownerId = :id', { id })
      .andWhere('doc.isDeleted = :bool', { bool: false })
    ;
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  /**
   * It returns a page of students who are currently assigned to the staff member with the given id
   * @param {Uuid} id - Uuid - the id of the staff member
   * @param {PageOptionsDto} pageOptionsDto - This is a class that contains the page number and the page size.
   * @returns A page of students that are currently assigned to the staff member with the given id.
   */
  async findStaffAssignedDocs(
    id: Uuid,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentDto>> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.currentlyAssigned = :id', { id })
      .andWhere('doc.isDeleted = :bool', { bool: false });
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  /**
   * It updates a document that is assigned to a staff member
   * @param {Uuid} staffId - Uuid - The id of the staff member who is currently assigned to the document
   * @param {Uuid} docId - Uuid,
   * @param {UpdateDocumentDto} updateDocumentDto - UpdateDocumentDto
   * @returns The updated document entity.
   */
  async updateStaffAssignedDoc(
    staffId: Uuid,
    docId: Uuid,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.currentlyAssignedId = :id', { id: staffId })
      .andWhere('doc.id = :id', { id: docId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update({ id: docId }, updateDocumentDto);

    return docEntity;
  }

  /**
   * "Update a document owned by a student."
   *
   * The first thing we do is create a query builder. We use the query builder to find the document we want to update. We
   * use the `andWhere` method to make sure the document we're updating is owned by the student
   * @param {Uuid} studentId - Uuid - The student's ID
   * @param {Uuid} docId - Uuid,
   * @param {UpdateDocumentDto} updateDocumentDto - UpdateDocumentDto
   * @returns The updated document entity.
   */
  async studentUpdateDoc(
    studentId: Uuid,
    docId: Uuid,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownerId = :id', { id: studentId })
      .andWhere('doc.id = :id', { id: docId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update({ id: docId }, updateDocumentDto);

    return docEntity;
  }

  /**
   * It returns a document entity with the specified id, owned by the specified student, with the owner, currently assigned
   * and workflow details
   * @param {Uuid} studentId - Uuid - This is the id of the student who owns the document.
   * @param {Uuid} id - Uuid - This is the id of the document you want to retrieve.
   * @returns A document entity
   */
  async studentFindOne(studentId: Uuid, docId: Uuid): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id: docId })
      .andWhere('doc.ownerId = :oid', { oid: studentId })
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

  /**
   * It returns a document entity with the specified id, and the owner, currentlyAssigned and workflow entities associated
   * with it
   * @param {Uuid} staffId - Uuid - This is the id of the staff that is currently logged in.
   * @param {Uuid} id - Uuid - This is the id of the document you want to retrieve.
   * @returns A document entity
   */
  async staffFindOne(staffId: Uuid, id: Uuid): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id })
      .andWhere('doc.currentlyAssignedId = :sid', { sid: staffId })
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
}
