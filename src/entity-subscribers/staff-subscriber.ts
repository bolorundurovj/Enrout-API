import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { generateHash } from '../common/utils';
import { StaffEntity } from '../modules/staff/entities/staff.entity';

@EventSubscriber()
export class StaffSubscriber implements EntitySubscriberInterface<StaffEntity> {
  listenTo(): typeof StaffEntity {
    return StaffEntity;
  }

  beforeInsert(event: InsertEvent<StaffEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<StaffEntity>): void {
    // FIXME check event.databaseEntity.password
    const entity = event.entity as StaffEntity;

    if (entity.password) {
      entity.password = generateHash(entity.password);
    }

    // if (entity.password && entity.password !== event.databaseEntity.password) {
    //   entity.password = generateHash(entity.password);
    // }
  }
}
