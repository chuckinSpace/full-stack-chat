import { ChatRoomsType } from '../enums/chat-rooms-type.enum';

export interface IChat {
  id?: string;
  rooms: ChatRoomsType[];
}
