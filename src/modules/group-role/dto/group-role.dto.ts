import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StaffDesignation } from '../../../constants';
import type { GroupRoleEntity } from '../entities/group-role.entity';

export type GroupRoleDtoOptions = Partial<{ isActive: boolean }>;

export class GroupRoleDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: StaffDesignation })
  designation: StaffDesignation;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(groupRole: GroupRoleEntity, options?: GroupRoleDtoOptions) {
    super(groupRole);
    this.name = groupRole.name;
    this.designation = groupRole.designation;
    this.isActive = options?.isActive;
  }
}
