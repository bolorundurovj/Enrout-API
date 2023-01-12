import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Trim } from '../../../decorators/transform.decorators';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly token: string;
}
