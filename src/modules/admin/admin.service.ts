import { Injectable } from '@nestjs/common';

import { DepartmentService } from '../department/department.service';
import { DocumentService } from '../document/document.service';
import { GroupService } from '../group/group.service';
import { GroupRoleService } from '../group-role/group-role.service';
import { StaffService } from '../staff/staff.service';
import { StudentService } from '../student/student.service';
import { UserService } from '../user/user.service';
import { WorkflowService } from '../workflow/workflow.service';
import { EntityCountDto } from './dto/entity-count.dto';

@Injectable()
export class AdminService {
  constructor(
    private staffService: StaffService,
    private workflowService: WorkflowService,
    private studentService: StudentService,
    private docService: DocumentService,
    private groupService: GroupService,
    private roleService: GroupRoleService,
    private deptService: DepartmentService,
    private userService: UserService,
  ) {}

  /**
   * It returns a new instance of the EntityCountDto class, which is a class that contains the number of entities in the
   * database
   * @returns A new instance of the EntityCountDto class.
   */
  async getEntityCounts(): Promise<EntityCountDto> {
    const staff = await this.staffService.getCount();
    const students = await this.studentService.getCount();
    const groups = await this.groupService.getCount();
    const groupRoles = await this.roleService.getCount();
    const workflows = await this.workflowService.getCount();
    const documents = await this.docService.getCount();
    const departments = await this.deptService.getCount();
    const admins = await this.userService.getAdminCount();
    const users = await this.userService.getUserCount();

    return new EntityCountDto(
      students,
      staff,
      workflows,
      documents,
      departments,
      users,
      admins,
      groups,
      groupRoles,
    );
  }
}
