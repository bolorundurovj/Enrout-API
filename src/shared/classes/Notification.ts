export class Notification {
  id: string;

  title: string;

  message: string;

  ownerId: string;

  type: 'approval' | 'modification' | 'rejection' | 'other';

  isRead: boolean;

  createdAt: Date;

  constructor(id: string, title: string, message: string, ownerId: string) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.ownerId = ownerId;
    this.type = 'other';
    this.isRead = false;
    this.createdAt = new Date();
  }
}
