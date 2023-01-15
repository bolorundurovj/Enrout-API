import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { generateHash } from '../common/utils';
import { StudentEntity } from '../modules/student/entities/student.entity';

@EventSubscriber()
export class StudentSubscriber
  implements EntitySubscriberInterface<StudentEntity>
{
  listenTo(): typeof StudentEntity {
    return StudentEntity;
  }

  beforeInsert(event: InsertEvent<StudentEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<StudentEntity>): void {
    // FIXME check event.databaseEntity.password
    const entity = event.entity as StudentEntity;

    if (entity.password) {
      entity.password = generateHash(entity.password);
    }

    // if (entity.password && entity.password !== event.databaseEntity.password) {
    //   entity.password = generateHash(entity.password);
    // }
  }
}
