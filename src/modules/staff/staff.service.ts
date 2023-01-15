import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { FileNotImageException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import type { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffEntity } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private staffRepository: Repository<StaffEntity>,
    private awsS3Service: AwsS3Service,
    private validatorService: ValidatorService,
  ) {}

  @Transactional()
  async create(
    createStaffDto: CreateStaffDto,
    file?: IFile,
  ): Promise<StaffEntity> {
    const staff = this.staffRepository.create(createStaffDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      staff.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.staffRepository.save(staff);

    return staff;
  }

  findAll() {
    return `This action returns all staff`;
  }

  findOne(
    findData: FindOptionsWhere<StaffEntity>,
  ): Promise<StaffEntity | null> {
    return this.staffRepository.findOneBy(findData);
  }

  findById(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return {
      id,
      staff: updateStaffDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
