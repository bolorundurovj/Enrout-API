import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import type { RoleType } from '../../constants';
import { TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { MailService } from '../../mail/mail.service';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { StaffEntity } from '../staff/entities/staff.entity';
import { StaffService } from '../staff/staff.service';
import type { StudentEntity } from '../student/entities/student.entity';
import { StudentService } from '../student/student.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import type { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
    private studentService: StudentService,
    private staffService: StaffService,
    private mailService: MailService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }

  async validateStudent(userLoginDto: UserLoginDto): Promise<StudentEntity> {
    const user = await this.studentService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }

  async validateStaff(userLoginDto: UserLoginDto): Promise<StaffEntity> {
    const user = await this.staffService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }

  async resetPassword(token: string, password: string) {
    try {
      if (this.jwtService.verify(token)) {
        const decodedToken = this.jwtService.decode(token)!;
        const { userId } = <{ userId: Uuid }>decodedToken;
        const user = await this.userService.findOne({
          id: userId,
        });

        if (!user) {
          return new UserNotFoundException();
        }

        await this.userService.savePassword(user, password);
      }
    } catch (error) {
      console.error(error);

      throw new BadRequestException();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findOne({
      email,
    });

    if (!user) {
      throw new UserNotFoundException();
    } else {
      const jwt = await this.createWeakAuthToken({ userId: user.id });

      const tokenExpiry = new Date(Date.now() + jwt.expiresIn * 1000);

      await this.userService.saveToken(user, jwt.accessToken, tokenExpiry);

      await this.mailService.forgotPassword({
        to: email,
        data: {
          hash: jwt.accessToken,
          expires: jwt.expiresIn / 60,
        },
      });
    }
  }

  async createWeakAuthToken(data: { userId: Uuid }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.secondaryJwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.BASIC_TOKEN,
      }),
    });
  }
}
