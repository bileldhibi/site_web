import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/database';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  users: User[] = [];
  recipient = '';
  message = '';
  messages: Message[] = [];
  sender = '';
  
  

  constructor(private db: AngularFireDatabase,private firebaseService:MessageService,private afAuth: AngularFireAuth) { 
    
  }

  ngOnInit(): void {
    this.db.list<User>('Users').valueChanges().subscribe(users => {
      this.users = users;
    });
    this.db.list<Message>('Messages').valueChanges().subscribe(messages => {
      this.messages = messages;
    });
    this.afAuth.currentUser.then(user => {
      this.sender = user?.displayName || 'Unknown';
    });
  }
  async sendMessage() {
    if (!this.recipient) {
      console.log('Please select a recipient');
      return;
    }
    if (!this.sender) {
      console.log('Please login to send messages');
      return;
    }
    const message: Message = { sender: this.sender, recipient: this.recipient, content: this.message };
    this.db.list<Message>('Messages').push(message);
    this.message = '';
  }
}
interface User {
  nom: string;
  prenom: string;
}

interface Message {
  sender: string;
  recipient: string;
  content: string;
}