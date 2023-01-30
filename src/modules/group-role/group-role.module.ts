import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRoleEntity } from './entities/group-role.entity';
import { GroupRoleController } from './group-role.controller';
import { GroupRoleService } from './group-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRoleEntity])],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
  exports: [GroupRoleService],
})
export class GroupRoleModule {}
