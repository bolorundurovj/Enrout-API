import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { Trim } from '../../../decorators';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  groupId: Uuid;
}
