import { forwardRef, Module } from '@nestjs/common';

import { DepartmentModule } from '../department/department.module';
import { DocumentModule } from '../document/document.module';
import { GroupModule } from '../group/group.module';
import { GroupRoleModule } from '../group-role/group-role.module';
import { StaffModule } from '../staff/staff.module';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    forwardRef(() => StaffModule),
    forwardRef(() => StudentModule),
    forwardRef(() => DocumentModule),
    forwardRef(() => UserModule),
    forwardRef(() => StaffModule),
    forwardRef(() => GroupModule),
    forwardRef(() => GroupRoleModule),
    forwardRef(() => WorkflowModule),
    forwardRef(() => DepartmentModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
