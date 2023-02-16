import { Injectable } from '@nestjs/common';
import { FirestoreService } from '@nhogs/nestjs-firebase';
import { v4 } from 'uuid';

import { Notification } from '../classes/Notification';

@Injectable()
export class NotificationService {
  constructor(private fireStore: FirestoreService) {}

  /**
   * It creates a new notification document in the notifications collection
   * @param {string} title - The title of the notification
   * @param {string} message - string - The message you want to send to the user.
   * @param {string} ownerId - The user id of the user who owns the notification.
   */
  async createNotification(title: string, message: string, ownerId: string) {
    const notificationId = v4();
    const doc = this.fireStore.doc('notifications', notificationId);
    const notification = new Notification(
      notificationId,
      title,
      message,
      ownerId,
    );
    await this.fireStore.setDoc(doc, { ...notification });
  }
}
