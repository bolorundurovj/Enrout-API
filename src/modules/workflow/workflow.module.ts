import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkflowEntity } from './entities/workflow.entity';
import { WorkflowItemEntity } from './entities/workflow-item.entity';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowEntity, WorkflowItemEntity])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
