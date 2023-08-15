import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private db: AngularFireDatabase) { }
  sendMessage(message: string, senderId: string, receiverId: string): void {
    const timestamp = Date.now();
    const chatId = `${senderId}-${receiverId}`;

    this.db.list(`chats/${chatId}`).push({
      message,
      senderId,
      timestamp
    });
  }

  getMessages(senderId: string, receiverId: string): Observable<any[]> {
    const chatId = `${senderId}-${receiverId}`;
    return this.db.list(`chats/${chatId}`).valueChanges();
  }
}
