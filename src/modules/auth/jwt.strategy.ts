import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RoleType, TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { StaffEntity } from '../staff/entities/staff.entity';
import { StaffService } from '../staff/staff.service';
import type { StudentEntity } from '../student/entities/student.entity';
import { StudentService } from '../student/student.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    private staffService: StaffService,
    private studentService: StudentService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    userId: Uuid;
    role: RoleType;
    type: TokenType;
  }): Promise<IUnifiedUser> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    let user: UserEntity | StaffEntity | StudentEntity | null;

    if (args.role === RoleType.STAFF) {
      user = await this.staffService.findOne({
        id: args.userId as never,
      });
    } else if (args.role === RoleType.STUDENT) {
      user = await this.studentService.findOne({
        id: args.userId as never,
      });
    } else {
      user = await this.userService.findOne({
        // FIXME: issue with type casts
        id: args.userId as never,
        role: args.role,
      });
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    const unifiedUser: IUnifiedUser = {
      id: user.id,
      role: args.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    // @ts-ignore
    if (!(user instanceof UserEntity)) {
      unifiedUser.departmentId = user.departmentId;
    }

    return unifiedUser;
  }
}

export interface IUnifiedUser {
  id: string;
  role: RoleType;
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: string;
}
