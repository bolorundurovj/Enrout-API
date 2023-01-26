import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../../mail/mail.module';
import { DocumentModule } from '../document/document.module';
import { StaffModule } from '../staff/staff.module';
import { StudentEntity } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

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
