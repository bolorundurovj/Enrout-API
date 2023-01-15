import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { ApiFile, Auth, AuthUser } from '../../decorators';
import { IFile } from '../../interfaces';
import { StaffDto } from '../staff/dto/staff.dto';
import { StaffService } from '../staff/staff.service';
import { StudentDto } from '../student/dto/student.dto';
import { StudentService } from '../student/student.service';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { StaffLoginPayloadDto } from './dto/StaffLoginPayloadDto';
import { StaffRegisterDto } from './dto/StaffRegisterDto';
import { StudentLoginPayloadDto } from './dto/StudentLoginPayloadDto';
import { StudentRegisterDto } from './dto/StudentRegisterDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private studentService: StudentService,
    private staffService: StaffService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Post('students/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Student info with access token',
  })
  async studentLogin(
    @Body() studentLoginDto: UserLoginDto,
  ): Promise<StudentLoginPayloadDto> {
    const userEntity = await this.authService.validateStudent(studentLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: RoleType.STUDENT,
    });

    return new StudentLoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('students/register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: StudentDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async studentRegister(
    @Body() studentRegisterDto: StudentRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<StudentDto> {
    const createdUser = await this.studentService.create(
      studentRegisterDto,
      file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Post('staff/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Staff info with access token',
  })
  async staffLogin(
    @Body() staffLoginDto: UserLoginDto,
  ): Promise<StaffLoginPayloadDto> {
    const userEntity = await this.authService.validateStaff(staffLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: RoleType.STAFF,
    });

    return new StaffLoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('staff/register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: StaffDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async staffRegister(
    @Body() staffRegisterDto: StaffRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<StaffDto> {
    const createdUser = await this.staffService.create(staffRegisterDto, file);

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ForgotPasswordDto,
    description: 'User info with access token',
  })
  async forgotUserPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(forgotPasswordDto.email);

    return {
      message: 'Reset Success',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPasswordDto,
    description: 'User info with access token',
  })
  async resetUserPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );

    return {
      message: 'Reset Success',
    };
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
