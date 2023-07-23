import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://memefy-7rmx.onrender.com/');
  }

  public getSocket() {
    return this.socket;
  }
}
