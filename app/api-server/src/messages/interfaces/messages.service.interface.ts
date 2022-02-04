import { ChatRoomsType } from '../../chat/enums/chat-rooms-type.enum';
import { UpdateMessageDTO } from '../dtos/update-message.dto';
import { MessageDocument } from '../messages.schema';
import { IMessage } from './message.interface';

export interface IMessageService {
  createTestingMessages(): Promise<void>;
  createMessage(messageInput: IMessage): Promise<MessageDocument>;
  getRoomMessages(room: ChatRoomsType): Promise<MessageDocument[]>;
  getMessage(messageId: string): Promise<MessageDocument>;
  delete(userId: string, messageId: string): Promise<MessageDocument>;
  update(updateMessageInput: UpdateMessageDTO): Promise<MessageDocument>;
}
