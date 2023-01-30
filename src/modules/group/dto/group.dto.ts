import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DivisionType } from '../../../constants';
import type { GroupEntity } from '../entities/group.entity';

export type GroupDtoOptions = Partial<{ isActive: boolean }>;

export class GroupDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: DivisionType })
  division: DivisionType;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(group: GroupEntity, options?: GroupDtoOptions) {
    super(group);
    this.name = group.name;
    this.division = group.division;
    this.isActive = options?.isActive;
  }
}
