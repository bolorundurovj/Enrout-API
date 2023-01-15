import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { FileNotImageException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateStudentDto } from './dto/create-student.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    private awsS3Service: AwsS3Service,
    private validatorService: ValidatorService,
  ) {}

  @Transactional()
  async create(
    createStudentDto: CreateStudentDto,
    file?: IFile,
  ): Promise<StudentEntity> {
    const student = this.studentRepository.create(createStudentDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      student.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.studentRepository.save(student);

    return student;
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(
    findData: FindOptionsWhere<StudentEntity>,
  ): Promise<StudentEntity | null> {
    return this.studentRepository.findOneBy(findData);
  }

  findById(id: number) {
    return `This action gets a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return {
      id,
      student: updateStudentDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
