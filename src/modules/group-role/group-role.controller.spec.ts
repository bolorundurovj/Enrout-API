import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { GroupRoleController } from './group-role.controller';
import { GroupRoleService } from './group-role.service';

describe('GroupRoleController', () => {
  let controller: GroupRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRoleController],
      providers: [GroupRoleService],
    }).compile();

    controller = module.get<GroupRoleController>(GroupRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
