import { ChatRoomsType } from 'src/chat/enums/chat-rooms-type.enum';

export interface IMessage {
  room: ChatRoomsType;
  userId: string;
  message: string;
}
