import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { ChatRoomsType } from '../chat/enums/chat-rooms-type.enum';
import { validate } from '../utils/validate';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { UpdateMessageDTO } from './dtos/update-message.dto';
import { IMessage } from './interfaces/message.interface';
import { IMessageService } from './interfaces/messages.service.interface';
import { MessageDocument, MessageModel } from './messages.schema';

@Injectable()
export class MessagesService implements IMessageService, OnModuleInit {
  constructor(
    @InjectModel(MessageModel.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async onModuleInit() {
    await this.createTestingMessages();
  }
  async createTestingMessages(): Promise<void> {
    const testMessages: IMessage[] = [
      {
        message: 'Hi There im the first message Wuhuuu',
        room: ChatRoomsType.GENERAL,
        userId: 'Batman',
      },
      {
        message: 'Hey Batman, go get me some soda',
        room: ChatRoomsType.GENERAL,
        userId: 'Superman',
      },
      {
        message: 'We are all techy people here',
        room: ChatRoomsType.TECHY_FELLOWS,
        userId: 'Elon is a Must',
      },
      {
        message: 'I think i just hacked NASA',
        room: ChatRoomsType.TECHY_FELLOWS,
        userId: 'HuCker',
      },
    ];
    const messages = await this.messageModel.find();
    if (isEmpty(messages)) await this.messageModel.create(testMessages);
  }
  async createMessage(
    messageInput: CreateMessageDTO,
  ): Promise<MessageDocument> {
    await validate(messageInput, CreateMessageDTO);
    return await this.messageModel.create(messageInput);
  }
  async getRoomMessages(room: ChatRoomsType): Promise<MessageDocument[]> {
    class Params {
      @IsDefined()
      @IsEnum(ChatRoomsType)
      room: ChatRoomsType;
    }
    await validate({ room }, Params);
    return await this.messageModel.find({ room });
  }
  async getMessage(messageId: string): Promise<MessageDocument> {
    class Params {
      @IsNotEmpty()
      @IsDefined()
      messageId: string;
    }
    await validate({ messageId }, Params);
    return await this.messageModel.findById(messageId);
  }
  async delete(userId: string, messageId: string): Promise<MessageDocument> {
    class Params {
      @IsNotEmpty()
      @IsDefined()
      userId: string;
      @IsNotEmpty()
      @IsDefined()
      messageId: string;
    }
    await validate({ userId, messageId }, Params);

    const message = await this.getMessage(messageId);
    // only owner can delete
    if (message && message.userId === userId) {
      return await this.messageModel.findByIdAndDelete(messageId);
    } else {
      throw new UnauthorizedException();
    }
  }
  async update(updateMessageInput: UpdateMessageDTO): Promise<MessageDocument> {
    await validate(updateMessageInput, UpdateMessageDTO);

    const { userId, messageId, newMessage } = updateMessageInput;

    const message = await this.getMessage(messageId);
    // only owner can update
    if (message.userId === userId) {
      return await this.messageModel.findByIdAndUpdate(
        messageId,
        {
          message: newMessage,
        },
        { new: true },
      );
    } else {
      throw new UnauthorizedException();
    }
  }
}
