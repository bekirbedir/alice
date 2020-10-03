import { Component, OnInit } from '@angular/core';
import { ChatAdapter } from 'ng-chat';
import { SocketIOAdapter } from './socketio-adapter'
import { Socket } from 'ng-socket-io';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.css']
})
export class MessageUserComponent implements OnInit {
  ngOnInit(): void {
    this.InitializeSocketListerners(localStorage.getItem('userId'));  
    this.joinRoom()
  }


  title = 'app';
  
  userId: string;
  username: string;
  isActive=false
  public adapter: ChatAdapter;

  constructor(private socket: Socket, private http: HttpClient) {


    const aliceuser = JSON.parse(localStorage.getItem('aliceuser'));
    if(aliceuser!=null){
      console.log("user true oldu")
      this.isActive=true
    }

 
  }

  public joinRoom(): void 
  {
    console.log("joined",this.adapter)
    this.socket.emit("join", "test");
  }

  public InitializeSocketListerners(userId): void
  {
    this.socket.on("generatedUserId", (userId) => {
      // Initializing the chat with the userId and the adapter with the socket instance
      this.adapter = new SocketIOAdapter(userId, this.socket, this.http);
      this.userId = userId;
    });
  }


}
