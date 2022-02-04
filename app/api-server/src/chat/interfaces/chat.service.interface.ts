import { ChatRoomsType } from '../enums/chat-rooms-type.enum';
import { IChat } from './chat.interface';

export interface IChatService {
  createDefaultChatRooms(): Promise<void>;
  getChatRooms(): Promise<ChatRoomsType[]>;
  create(chatInput: IChat): Promise<void>;
}
