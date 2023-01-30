import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StudentRoleType } from '../../../constants';
import type { StudentEntity } from '../entities/student.entity';

export type StudentDtoOptions = Partial<{ isActive: boolean }>;

export class StudentDto extends AbstractDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: StudentRoleType })
  role: StudentRoleType;

  @ApiProperty()
  matricNo: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(student: StudentEntity, options?: StudentDtoOptions) {
    super(student);
    this.firstName = student.firstName;
    this.lastName = student.lastName;
    this.role = student.role;
    this.matricNo = student.matricNo;
    this.email = student.email;
    this.avatar = student.avatar;
    this.phone = student.phone;
    this.isActive = options?.isActive;
  }
}
