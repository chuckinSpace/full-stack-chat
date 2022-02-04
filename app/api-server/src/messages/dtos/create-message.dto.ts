import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { ChatRoomsType } from '../../chat/enums/chat-rooms-type.enum';

export class CreateMessageDTO {
  @IsDefined()
  @IsEnum(ChatRoomsType)
  room: ChatRoomsType;
  @IsDefined()
  @IsNotEmpty()
  userId: string;
  @IsDefined()
  @IsNotEmpty()
  message: string;
}
