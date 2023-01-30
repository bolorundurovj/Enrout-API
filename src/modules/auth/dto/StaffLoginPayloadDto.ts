import { ApiProperty } from '@nestjs/swagger';

import { StaffDto } from '../../staff/dto/staff.dto';
import { TokenPayloadDto } from './TokenPayloadDto';

export class StaffLoginPayloadDto {
  @ApiProperty({ type: StaffDto })
  user: StaffDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: StaffDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
