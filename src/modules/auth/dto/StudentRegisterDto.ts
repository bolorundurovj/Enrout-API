import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transform.decorators';
import { IsValidStudentEmail } from '../../../validators/student-mail.validator';

export class StudentRegisterDto {
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
  @IsValidStudentEmail()
  @Trim()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly matricNo: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Trim()
  departmentId: Uuid;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @Column()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
}
