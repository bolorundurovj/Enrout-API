import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from '@nhogs/nestjs-firebase';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { DocumentState, StaffDesignation } from '../../constants';
import { FileNotPdfException } from '../../exceptions';
import type { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { StatisticsDto } from '../staff/dto/statistics.dto';
import { StaffService } from '../staff/staff.service';
import { WorkflowService } from '../workflow/workflow.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import type { DocumentDto } from './dto/document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentEntity } from './entities/document.entity';

const uniqueStatuses = [
  DocumentState.PENDING,
  DocumentState.APPROVED,
  DocumentState.REJECTED,
  DocumentState.CHANGE_REQUESTED,
  DocumentState.DRAFT,
];

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private docRepository: Repository<DocumentEntity>,
    private staffService: StaffService,
    private workflowService: WorkflowService,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private storageService: StorageService,
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
   * It rejects a document by updating its state to REJECTED and adding a reviewer comment
   * @param {Uuid} userId - Uuid - The user id of the user who is rejecting the document
   * @param deptId
   * @param designation
   * @param {Uuid} docId - The id of the document to be rejected.
   * @param {string} comment - string - the comment that the reviewer will add to the document
   * @returns DocumentEntity
   */
  async rejectDocument(
    userId: Uuid,
    deptId: Uuid,
    designation: StaffDesignation,
    docId: Uuid,
    comment: string,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :did', { did: docId })
      .andWhere('doc.currentlyAssigned = :id', { id: userId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    const workflow = await this.workflowService.findOne(docEntity.workflowId);

    const currentIdx = workflow.workflowItems.findIndex(
      (x) => x.groupRole.designation === designation,
    );

    if (currentIdx > 0) {
      const staffEntity = await ([
        StaffDesignation.HOD,
        StaffDesignation.Dean,
      ].includes(workflow.workflowItems[currentIdx - 1].groupRole.designation)
        ? this.staffService.findOneByDeptAndRole(
            deptId,
            workflow.workflowItems[currentIdx - 1].groupRole.designation,
          )
        : this.staffService.findOne({
            designation:
              workflow.workflowItems[currentIdx - 1].groupRole.designation,
          }));

      if (!staffEntity) {
        throw new NotFoundException('Staff not found');
      }

      docEntity.currentlyAssignedId = staffEntity.id;

      await this.docRepository.update(
        { id: docId },
        {
          currentlyAssignedId: staffEntity.id,
          reviewerComment: comment,
          reviewerAttachment: docEntity.reviewerAttachment,
        },
      );
    } else {
      await this.docRepository.update(
        { id: docId },
        {
          reviewerComment: comment,
          state: DocumentState.REJECTED,
        },
      );
      docEntity.state = DocumentState.REJECTED;
    }

    return docEntity;
  }

  /**
   * "Update the document with the given ID to have the state CHANGE_REQUESTED and the given comment."
   *
   * The first thing we do is create a query builder. This is a tool that allows us to build a query to the database. We
   * use it to find the document with the given ID and that is currently assigned to the given user
   * @param {Uuid} userId - The id of the user who is requesting changes.
   * @param {Uuid} docId - The id of the document that the user wants to request changes on.
   * @param {string} comment - string - The comment that the reviewer has left for the author.
   * @returns DocumentEntity
   */
  async requestChangesOnDocument(
    userId: Uuid,
    docId: Uuid,
    comment: string,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :did', { did: docId })
      .andWhere('doc.currentlyAssigned = :id', { id: userId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update(
      { id: docId },
      { state: DocumentState.CHANGE_REQUESTED, reviewerComment: comment },
    );

    return docEntity;
  }

  /**
   * It forwards a document to the next person in the workflow
   * @param {Uuid} userId - The id of the user who is forwarding the document.
   * @param {Uuid} deptId - The department id of the user who is forwarding the document.
   * @param {StaffDesignation} designation - StaffDesignation,
   * @param {Uuid} docId - The id of the document to be forwarded.
   * @param {string} [comment] - The comment that the reviewer has made.
   * @param {IFile} [file] - IFile - This is the file that the user uploads.
   * @returns DocumentEntity
   */
  async forwardDocument(
    userId: Uuid,
    deptId: Uuid,
    designation: StaffDesignation,
    docId: Uuid,
    comment?: string,
    file?: IFile,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :did', { did: docId })
      .andWhere('doc.currentlyAssigned = :id', { id: userId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException('Document not found');
    }

    if (file && !this.validatorService.isPDF(file.mimetype)) {
      throw new FileNotPdfException();
    }

    if (file) {
      const fileName = `${docEntity.title}_${userId}_${file.originalname}`;
      await this.storageService.uploadBytes(fileName, file.buffer);

      docEntity.reviewerAttachment = await this.storageService.getDownloadURL(
        fileName,
      );
    }

    const workflow = await this.workflowService.findOne(docEntity.workflowId);

    const currentIdx = workflow.workflowItems.findIndex(
      (x) => x.groupRole.designation === designation,
    );

    if (currentIdx < workflow.workflowItems.length - 1) {
      const staffEntity = await ([
        StaffDesignation.HOD,
        StaffDesignation.Dean,
      ].includes(workflow.workflowItems[currentIdx + 1].groupRole.designation)
        ? this.staffService.findOneByDeptAndRole(
            deptId,
            workflow.workflowItems[currentIdx + 1].groupRole.designation,
          )
        : this.staffService.findOne({
            designation:
              workflow.workflowItems[currentIdx + 1].groupRole.designation,
          }));

      if (!staffEntity) {
        throw new NotFoundException('Staff not found');
      }

      docEntity.currentlyAssignedId = staffEntity.id;

      await this.docRepository.update(
        { id: docId },
        {
          currentlyAssignedId: staffEntity.id,
          reviewerComment: comment,
          reviewerAttachment: docEntity.reviewerAttachment,
        },
      );
    } else {
      await this.docRepository.update(
        { id: docId },
        {
          reviewerComment: comment,
          reviewerAttachment: docEntity.reviewerAttachment,
          state: DocumentState.APPROVED,
        },
      );
      docEntity.state = DocumentState.APPROVED;
    }

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
      .andWhere('doc.isDeleted = :bool', { bool: false });
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
   * It updates the document with the given id, owned by the student with the given id, with the given data
   * @param {Uuid} studentId - Uuid - The student's ID
   * @param {Uuid} docId - Uuid,
   * @param {UpdateDocumentDto} updateDocumentDto - UpdateDocumentDto
   * @returns The updated document entity
   */
  async studentResolveDoc(
    studentId: Uuid,
    docId: Uuid,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownerId = :sid', { sid: studentId })
      .andWhere('doc.id = :id', { id: docId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update(
      { id: docId },
      { ...updateDocumentDto, state: DocumentState.PENDING },
    );

    return docEntity;
  }

  /**
   * It returns a document entity with the specified id, owned by the specified student, with the owner, currently assigned
   * and workflow details
   * @param {Uuid} studentId - Uuid - This is the id of the student who owns the document.
   * @param {Uuid} docId - Uuid - This is the id of the document you want to retrieve.
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

  /**
   * "Update the workflowId of the document with the given id, but only if the document is currently assigned to the user
   * with the given id."
   *
   * The first thing we do is create a query builder. This is a special object that allows us to build up a query that we
   * can then execute. We use the query builder to find the document with the given id, and that is currently assigned to
   * the user with the given id
   * @param {Uuid} userId - The userId of the user who is currently assigned to the document.
   * @param {Uuid} docId - The id of the document you want to update
   * @param {string} workflowId - The id of the workflow to set the document to.
   * @returns The document entity that was updated.
   */
  async setDocumentWorkflow(
    userId: Uuid,
    docId: Uuid,
    workflowId: string,
  ): Promise<DocumentEntity> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.id = :did', { did: docId })
      .andWhere('doc.currentlyAssigned = :id', { id: userId });

    const docEntity = await queryBuilder.getOne();

    if (!docEntity) {
      throw new NotFoundException();
    }

    await this.docRepository.update(
      { id: docId },
      { workflowId, reviewerComment: '', reviewerAttachment: '' },
    );

    return docEntity;
  }

  /**
   * It returns the number of documents in the database
   * @returns The number of documents in the database.
   */
  async getCount(): Promise<number> {
    const queryBuilder = this.docRepository.createQueryBuilder('doc');

    return queryBuilder.getCount();
  }

  /**
   * It returns the total number of documents, the number of students who have documents, and the number of documents in
   * each state
   * @param {Uuid} staffId - Uuid - The staff's id
   * @returns An object with the total number of documents, the number of students, and the number of documents in each
   * category.
   */
  async getStaffStatistics(staffId: Uuid): Promise<StatisticsDto> {
    const startOfDay = new Date();
    startOfDay.setDate(startOfDay.getDate() - 7);
    startOfDay.setHours(0, 0, 0, 0);

    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.currentlyAssigned = :id', { id: staffId });

    const total = await queryBuilder.getCount();
    const studentCount = await queryBuilder
      .select('COUNT(DISTINCT(owner_id))', 'count')
      .getRawOne();
    const categories = await this.docRepository
      .createQueryBuilder('doc')
      .where('doc.currentlyAssigned = :id', { id: staffId })
      .groupBy('doc.state')
      .orderBy('doc.state')
      .select('COUNT(doc.id)', 'count')
      .addSelect('doc.state', 'state')
      .getRawMany();

    const start = moment().subtract(6, 'days').startOf('day');
    const end = moment().endOf('day');

    const queryResult = await this.docRepository
      .createQueryBuilder('doc')
      .where('doc.currentlyAssigned = :id', { id: staffId })
      .select("state, DATE_TRUNC('day', created_at) as day, COUNT(id) as count")
      .where('created_at BETWEEN :start AND :end', { start, end })
      .groupBy('state, day')
      .orderBy('day, state')
      .getRawMany();

    const processedData = uniqueStatuses.map((state) => {
      const itemsByStatus = queryResult.filter((row) => row.state === state);
      // eslint-disable-next-line unicorn/no-array-reduce
      const countByDay = itemsByStatus.reduce((acc, row) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const day = moment(row.day).diff(start, 'days');
        acc[day] = Number(row.count);

        return acc;
      }, Array.from({ length: 7 }).fill(0));

      return { name: state, data: countByDay };
    });

    const stats = new StatisticsDto();

    stats.submissions = total;
    stats.submissionsByCategory = categories;
    stats.students = Number(studentCount.count);
    stats.weeklySubmissions = processedData;

    return stats;
  }

  /**
   * It returns a statistics object for a given student
   * @param {Uuid} studentId - Uuid - The student's ID
   * @returns A StatisticsDto object
   */
  async getStudentStatistics(studentId: Uuid): Promise<StatisticsDto> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownerId = :id', { id: studentId });

    const total = await queryBuilder.getCount();
    const staffCount = await queryBuilder
      .select('COUNT(DISTINCT(currently_assigned_id))', 'count')
      .getRawOne();
    const categories = await this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownerId = :id', { id: studentId })
      .groupBy('doc.state')
      .orderBy('doc.state')
      .select('COUNT(doc.id)', 'count')
      .addSelect('doc.state', 'state')
      .getRawMany();

    const start = moment().subtract(6, 'days').startOf('day');
    const end = moment().endOf('day');

    const queryResult = await this.docRepository
      .createQueryBuilder('doc')
      .where('doc.ownderId = :id', { id: studentId })
      .select("state, DATE_TRUNC('day', created_at) as day, COUNT(id) as count")
      .where('created_at BETWEEN :start AND :end', { start, end })
      .groupBy('state, day')
      .orderBy('day, state')
      .getRawMany();

    const processedData = uniqueStatuses.map((state) => {
      const itemsByStatus = queryResult.filter((row) => row.state === state);
      // eslint-disable-next-line unicorn/no-array-reduce
      const countByDay = itemsByStatus.reduce((acc, row) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const day = moment(row.day).diff(start, 'days');
        acc[day] = Number(row.count);

        return acc;
      }, Array.from({ length: 7 }).fill(0));

      return { name: state, data: countByDay };
    });

    const stats = new StatisticsDto();

    stats.submissions = total;
    stats.submissionsByCategory = categories;
    stats.students = Number(staffCount.count);
    stats.weeklySubmissions = processedData;

    return stats;
  }
}
