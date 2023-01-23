import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DocumentState } from '../../../constants';

export class DocumentDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  owner: string;

  @ApiProperty({ enum: DocumentState })
  state: DocumentState;

  @ApiProperty()
  handlers: string[];

  @ApiPropertyOptional()
  currentlyAssigned?: string;

  @ApiPropertyOptional()
  attachment?: string;

  @ApiPropertyOptional()
  workflowId?: string;
}
