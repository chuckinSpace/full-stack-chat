import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { ChatRoomsType } from './enums/chat-rooms-type.enum';
import { ChatRoomsWSEvents } from './enums/chat-rooms-ws-events.enum';
import { IChatGateway } from './interfaces/chat.gateway.interface';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway implements IChatGateway {
  constructor(private readonly messageService: MessagesService) {}

  @WebSocketServer() wss: Server;

  @SubscribeMessage(ChatRoomsWSEvents.REFRESH)
  async handleRefreshRoom(client: Socket, room: string) {
    this.wss.to(room).emit(ChatRoomsWSEvents.CHAT_TO_CLIENT, '');
  }

  @SubscribeMessage(ChatRoomsWSEvents.CHAT_TO_SERVER)
  async handleMessage(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    this.wss.to(message.room).emit(ChatRoomsWSEvents.CHAT_TO_CLIENT, message);

    // save message on DB
    await this.messageService.createMessage({
      message: message.message,
      room: message.room as ChatRoomsType,
      userId: message.sender,
    });
  }

  @SubscribeMessage(ChatRoomsWSEvents.JOIN_ROOM)
  handleRoomJoin(client: Socket, room: string) {
    client.join(room);
    client.emit(ChatRoomsWSEvents.JOIN_ROOM, room);
  }

  @SubscribeMessage(ChatRoomsWSEvents.LEAVE_ROOM)
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
    client.emit(ChatRoomsWSEvents.LEFT_ROOM, room);
  }
}
