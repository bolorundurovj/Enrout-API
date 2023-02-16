import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../../mail/mail.module';
import { DocumentModule } from '../document/document.module';
import { StudentModule } from '../student/student.module';
import { StaffEntity } from './entities/staff.entity';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffEntity]),
    forwardRef(() => DocumentModule),
    MailModule,
    forwardRef(() => StudentModule),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
