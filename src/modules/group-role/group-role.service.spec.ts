import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { GroupRoleService } from './group-role.service';

describe('GroupRoleService', () => {
  let service: GroupRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupRoleService],
    }).compile();

    service = module.get<GroupRoleService>(GroupRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
