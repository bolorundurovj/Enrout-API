import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from '@nhogs/nestjs-firebase';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { FileNotImageException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { UserDto } from '../user/dtos/user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import type { StudentDto } from './dto/student.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    private awsS3Service: AwsS3Service,
    private validatorService: ValidatorService,
    private storageService: StorageService,
  ) {}

  @Transactional()
  /**
   * It creates a new student, uploads the avatar to AWS S3, and saves the student to the database
   * @param {CreateStudentDto} createStudentDto - CreateStudentDto - This is the DTO that we created earlier.
   * @param {IFile} [file] - IFile - this is the file that was uploaded by the user.
   * @returns The student entity
   */
  async create(
    createStudentDto: CreateStudentDto,
    file?: IFile,
  ): Promise<StudentEntity> {
    const student = this.studentRepository.create(createStudentDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      const fileName = `${createStudentDto.firstName}_${createStudentDto.lastName}_${file.originalname}`;
      await this.storageService.uploadBytes(fileName, file.buffer);

      student.avatar = await this.storageService.getDownloadURL(fileName);
    }

    await this.studentRepository.save(student);

    return student;
  }

  /**
   * It takes a PageOptionsDto object as an argument, and returns a PageDto object
   * @param {PageOptionsDto} pageOptionsDto - This is a class that contains the page number and the page size.
   * @returns A PageDto<StudentDto>
   */
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<StudentDto>> {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  /**
   * It returns a promise of a student entity or null
   * @param findData - FindOptionsWhere<StudentEntity>
   * @returns Promise<StudentEntity | null>
   */
  findOne(
    findData: FindOptionsWhere<StudentEntity>,
  ): Promise<StudentEntity | null> {
    return this.studentRepository.findOneBy(findData);
  }

  /**
   * It creates a query builder, adds a where clause to it, and then executes the query
   * @param {Uuid} id - Uuid - The id of the student we want to find.
   * @returns StudentEntity
   */
  async findById(id: Uuid): Promise<StudentEntity> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.id = :id', { id });

    const studentEntity = await queryBuilder.getOne();

    if (!studentEntity) {
      throw new NotFoundException();
    }

    return studentEntity;
  }

  /**
   * We're using the `createQueryBuilder` method to create a query builder object, which we can use to build a query. We're
   * using the `where` method to add a `where` clause to the query. We're using the `getOne` method to execute the query
   * and return the first result
   * @param {Uuid} id - Uuid - The id of the student we want to update.
   * @param {UpdateStudentDto} updateStudentDto - UpdateStudentDto
   * @returns The studentEntity is being returned.
   */
  async update(
    id: Uuid,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.id = :id', { id });

    const studentEntity = await queryBuilder.getOne();

    if (!studentEntity) {
      throw new NotFoundException();
    }

    await this.studentRepository.update({ id }, updateStudentDto);

    return studentEntity;
  }

  /**
   * We're using the `createQueryBuilder` method to create a query builder object, which we can use to build a query. We're
   * using the `where` method to add a `where` clause to the query. We're using the `getOne` method to execute the query
   * and return the first result
   * @param {Uuid} id - Uuid - The id of the student to be deleted
   * @returns The studentEntity is being returned.
   */
  async remove(id: Uuid) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.id = :id', { id });

    const studentEntity = await queryBuilder.getOne();

    if (!studentEntity) {
      throw new NotFoundException();
    }

    await this.studentRepository.remove(studentEntity);

    return studentEntity;
  }

  /**
   * It takes a user, a hash, and a tokenExpiry, and then updates the user's token and tokenExpiry in the database
   * @param {StudentEntity} user - StudentEntity - The user entity that we want to save the token to.
   * @param {string} hash - The hashed token that will be saved in the database.
   * @param {Date} tokenExpiry - Date,
   * @returns The userEntity.raw is being returned.
   */
  async saveToken(
    user: StudentEntity,
    hash: string,
    tokenExpiry: Date,
  ): Promise<StudentDto> {
    user.token = hash;
    const userEntity = await this.studentRepository.update(
      { id: user.id },
      { token: hash, tokenExpiry },
    );

    return userEntity.raw;
  }

  /**
   * It takes a user and a password, and updates the user's password
   * @param {StudentEntity} user - StudentEntity - this is the user that we're updating
   * @param {string} password - string - The password that the user wants to set.
   * @returns UserDto
   */
  async savePassword(user: StudentEntity, password: string): Promise<UserDto> {
    const userEntity = await this.studentRepository.update(
      { id: user.id },
      { token: null!, tokenExpiry: null!, password },
    );

    return userEntity.raw;
  }
}
