import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentModule } from '../document/document.module';
import { StudentEntity } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity]), DocumentModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
