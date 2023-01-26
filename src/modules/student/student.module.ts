import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../../mail/mail.module';
import { DocumentModule } from '../document/document.module';
import { StudentEntity } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import {StaffModule} from "../staff/staff.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    DocumentModule,
    MailModule,
    StaffModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
