import { ApiProperty } from '@nestjs/swagger';

import { StudentDto } from '../../student/dto/student.dto';
import { TokenPayloadDto } from './TokenPayloadDto';

export class StudentLoginPayloadDto {
  @ApiProperty({ type: StudentDto })
  user: StudentDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: StudentDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
