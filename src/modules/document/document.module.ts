import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StaffModule } from '../staff/staff.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentEntity } from './entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    forwardRef(() => StaffModule)
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
