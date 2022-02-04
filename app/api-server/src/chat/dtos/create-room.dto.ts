import { IsDefined } from 'class-validator';
import { ChatRoomsType } from '../enums/chat-rooms-type.enum';

export class CreateChatRoomDTO {
  @IsDefined()
  rooms: ChatRoomsType[];
}
