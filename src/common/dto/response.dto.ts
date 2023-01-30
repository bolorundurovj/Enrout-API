import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDto<T> {
  @Expose()
  @ApiProperty()
  readonly data: T;

  @ApiProperty()
  readonly status: boolean;

  constructor(status: boolean, data: T) {
    this.status = status;
    this.data = data;
  }
}
