// src/services/SocketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);
  }

  // 监听事件
  public on(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  // 发送事件
  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // 断开连接
  public disconnect(): void {
    this.socket.disconnect();
  }

  // 连接
  public connect(): void {
    this.socket.connect();
  }
}

export default SocketService;
