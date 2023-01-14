import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { DivisionType } from '../../../constants';
import { UseDto } from '../../../decorators';
import type { GroupDtoOptions } from '../dto/group.dto';
import { GroupDto } from '../dto/group.dto';

export interface IGroupEntity extends IAbstractEntity<GroupDto> {
  name: string;

  division: DivisionType;
}

@Entity({ name: 'groups' })
@UseDto(GroupDto)
export class GroupEntity
  extends AbstractEntity<GroupDto, GroupDtoOptions>
  implements IGroupEntity
{
  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: DivisionType,
    default: DivisionType.ACADEMIC,
    nullable: false,
  })
  division: DivisionType;
}
