import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from '@nhogs/nestjs-firebase';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import type { StaffDesignation } from '../../constants';
import { FileNotImageException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import type { StaffDto } from './dto/staff.dto';
import type { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffEntity } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private staffRepository: Repository<StaffEntity>,
    private awsS3Service: AwsS3Service,
    private validatorService: ValidatorService,
    private storageService: StorageService,
  ) {}

  @Transactional()
  /**
   * It creates a new staff member, uploads the avatar to AWS S3, and saves the staff member to the database
   * @param {CreateStaffDto} createStaffDto - CreateStaffDto - This is the DTO that we created earlier.
   * @param {IFile} [file] - The file that was uploaded.
   * @returns StaffEntity
   */
  async create(
    createStaffDto: CreateStaffDto,
    file?: IFile,
  ): Promise<StaffEntity> {
    const staff = this.staffRepository.create(createStaffDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      const fileName = `${createStaffDto.firstName}_${createStaffDto.lastName}_${file.originalname}`;
      await this.storageService.uploadBytes(fileName, file.buffer);

      staff.avatar = await this.storageService.getDownloadURL(fileName);
    }

    await this.staffRepository.save(staff);

    return staff;
  }

  /**
   * It takes a PageOptionsDto object, creates a query builder, paginates the query, and returns a PageDto object
   * @param {PageOptionsDto} pageOptionsDto - This is a class that contains the page number and the page size.
   * @returns A PageDto<StaffDto>
   */
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<StaffDto>> {
    const queryBuilder = this.staffRepository.createQueryBuilder('student');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  /**
   * It returns a promise of a StaffEntity or null
   * @param findData - FindOptionsWhere<StaffEntity>
   * @returns A promise of a StaffEntity or null
   */
  findOne(
    findData: FindOptionsWhere<StaffEntity>,
  ): Promise<StaffEntity | null> {
    return this.staffRepository.findOneBy(findData);
  }

  /**
   * It finds a staff member by their department id and role
   * @param {Uuid} id - Uuid - The id of the department
   * @param {StaffDesignation} role - StaffDesignation - This is the enum that we created earlier.
   * @returns StaffEntity
   */
  async findOneByDeptAndRole(
    id: Uuid,
    role: StaffDesignation,
  ): Promise<StaffEntity> {
    const staffEntity = await this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.departmentId = :id', { id })
      .andWhere('staff.designation = :role', { role })
      .getOne();

    if (!staffEntity) {
      throw new NotFoundException('Staff Not Found');
    }

    return staffEntity;
  }

  /**
   * It creates a query builder, adds a where clause to it, and then executes the query
   * @param {Uuid} id - Uuid - The id of the staff member we want to find.
   * @returns StaffEntity
   */
  async findById(id: Uuid): Promise<StaffEntity> {
    const queryBuilder = this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.id = :id', { id });

    const staffEntity = await queryBuilder.getOne();

    if (!staffEntity) {
      throw new NotFoundException();
    }

    return staffEntity;
  }

  /**
   * It updates a staff member's details
   * @param {Uuid} id - Uuid - The id of the staff member to update
   * @param {UpdateStaffDto} updateStaffDto - UpdateStaffDto - This is the DTO that we created earlier.
   * @returns The staffEntity is being returned.
   */
  async update(id: Uuid, updateStaffDto: UpdateStaffDto): Promise<StaffEntity> {
    const queryBuilder = this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.id = :id', { id });

    const staffEntity = await queryBuilder.getOne();

    if (!staffEntity) {
      throw new NotFoundException();
    }

    await this.staffRepository.update({ id }, updateStaffDto);

    return staffEntity;
  }

  /**
   * It removes a staff member from the database
   * @param {Uuid} id - Uuid - The id of the staff member to be deleted
   * @returns The staffEntity is being returned.
   */
  async remove(id: Uuid) {
    const queryBuilder = this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.id = :id', { id });

    const staffEntity = await queryBuilder.getOne();

    if (!staffEntity) {
      throw new NotFoundException();
    }

    await this.staffRepository.remove(staffEntity);

    return staffEntity;
  }

  /**
   * It saves the token and token expiry date to the database
   * @param {StaffEntity} user - StaffEntity - The user entity that we want to save the token to
   * @param {string} hash - The hashed token that will be saved in the database.
   * @param {Date} tokenExpiry - Date,
   * @returns The userEntity.raw is being returned.
   */
  async saveToken(
    user: StaffEntity,
    hash: string,
    tokenExpiry: Date,
  ): Promise<StaffDto> {
    user.token = hash;
    const userEntity = await this.staffRepository.update(
      { id: user.id },
      { token: hash, tokenExpiry },
    );

    return userEntity.raw;
  }

  /**
   * It takes a user and a password, and updates the user's password
   * @param {StaffEntity} user - StaffEntity - This is the user that we are updating.
   * @param {string} password - string - The new password to be set
   * @returns StaffDto
   */
  async savePassword(user: StaffEntity, password: string): Promise<StaffDto> {
    const userEntity = await this.staffRepository.update(
      { id: user.id },
      { token: null!, tokenExpiry: null!, password },
    );

    return userEntity.raw;
  }
}
