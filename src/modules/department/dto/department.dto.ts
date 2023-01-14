import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { DepartmentEntity } from '../entities/department.entity';

export type DepartmentDtoOptions = Partial<{ isActive: boolean }>;

export class DepartmentDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  groupId: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(department: DepartmentEntity, options?: DepartmentDtoOptions) {
    super(department);
    this.name = department.name;
    this.isActive = options?.isActive;
  }
}
