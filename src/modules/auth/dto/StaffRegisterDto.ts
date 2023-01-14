import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transform.decorators';
import { IsValidStaffEmail } from '../../../validators/staff-mail.validator';

export class StaffRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsValidStaffEmail()
  @Trim()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly staffId: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @Column()
  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}
