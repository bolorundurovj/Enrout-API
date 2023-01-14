import { Injectable } from '@nestjs/common';

import type { CreateStaffDto } from './dto/create-staff.dto';
import type { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  create(createStaffDto: CreateStaffDto) {
    return createStaffDto;
  }

  findAll() {
    return `This action returns all staff`;
  }

  findOne(id: number) {
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
