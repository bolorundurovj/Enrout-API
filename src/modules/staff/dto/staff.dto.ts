import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StaffDesignation } from '../../../constants';
import type { StaffEntity } from '../entities/staff.entity';

export type StaffDtoOptions = Partial<{ isActive: boolean }>;

export class StaffDto extends AbstractDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: StaffDesignation })
  designation: StaffDesignation;

  @ApiProperty()
  staffId: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(staff: StaffEntity, options?: StaffDtoOptions) {
    super(staff);
    this.firstName = staff.firstName;
    this.lastName = staff.lastName;
    this.designation = staff.designation;
    this.staffId = staff.staffId;
    this.email = staff.email;
    this.avatar = staff.avatar;
    this.phone = staff.phone;
    this.isActive = options?.isActive;
  }
}
