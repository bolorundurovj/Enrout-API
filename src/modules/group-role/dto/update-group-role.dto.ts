import { PartialType } from '@nestjs/swagger';

import { CreateGroupRoleDto } from './create-group-role.dto';

export class UpdateGroupRoleDto extends PartialType(CreateGroupRoleDto) {}
