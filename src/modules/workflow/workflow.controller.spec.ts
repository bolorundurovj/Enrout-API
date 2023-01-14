import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';

describe('WorkflowController', () => {
  let controller: WorkflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [WorkflowService],
    }).compile();

    controller = module.get<WorkflowController>(WorkflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
