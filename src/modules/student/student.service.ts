import { Injectable } from '@nestjs/common';

import type { CreateStudentDto } from './dto/create-student.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  create(createStudentDto: CreateStudentDto) {
    return createStudentDto;
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
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
