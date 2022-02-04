import { Socket } from 'socket.io';

export interface IChatGateway {
  handleRefreshRoom(client: Socket, room: string): void;
  handleMessage(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ): void;
  handleRoomJoin(client: Socket, room: string): void;
  handleRoomLeave(client: Socket, room: string): void;
}
