import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './page-meta.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  @ApiProperty()
  readonly status: boolean;

  constructor(status: boolean, data: T[], meta: PageMetaDto) {
    this.status = status;
    this.data = data;
    this.meta = meta;
  }
}
