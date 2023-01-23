import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { DocumentState } from '../../../constants';
import { Trim } from '../../../decorators';
import { CreateDocumentDto } from './create-document.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiPropertyOptional()
  @IsString()
  @Trim()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  state?: DocumentState;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  attachment?: string;
}
