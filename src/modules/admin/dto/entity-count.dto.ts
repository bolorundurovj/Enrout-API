import { ApiProperty } from '@nestjs/swagger';

export class EntityCountDto {
  @ApiProperty()
  students: number;

  @ApiProperty()
  staff: number;

  @ApiProperty()
  workflows: number;

  @ApiProperty()
  documents: number;

  @ApiProperty()
  departments: number;

  @ApiProperty()
  users: number;

  @ApiProperty()
  admins: number;

  @ApiProperty()
  groups: number;

  @ApiProperty()
  groupRoles: number;

  constructor(
    students: number,
    staff: number,
    workflows: number,
    documents: number,
    departments: number,
    users: number,
    admins: number,
    groups: number,
    groupRoles: number,
  ) {
    this.students = students;
    this.staff = staff;
    this.workflows = workflows;
    this.documents = documents;
    this.departments = departments;
    this.users = users;
    this.admins = admins;
    this.groups = groups;
    this.groupRoles = groupRoles;
  }
}
