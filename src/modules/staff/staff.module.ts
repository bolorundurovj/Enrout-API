import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentModule } from '../document/document.module';
import { StaffEntity } from './entities/staff.entity';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffEntity]), DocumentModule],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
