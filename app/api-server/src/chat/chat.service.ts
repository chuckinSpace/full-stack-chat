import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { validate } from '../utils/validate';
import { DEFAULT_CHAT_ROOMS } from './chat.defaults';
import { ChatDocument, ChatModel } from './chat.schema';
import { CreateChatRoomDTO } from './dtos/create-room.dto';
import { ChatRoomsType } from './enums/chat-rooms-type.enum';
import { IChatService } from './interfaces/chat.service.interface';

@Injectable()
export class ChatService implements IChatService, OnModuleInit {
  constructor(
    @InjectModel(ChatModel.name)
    private chatModel: Model<ChatDocument>,
  ) {}

  async onModuleInit() {
    await this.createDefaultChatRooms();
  }

  async createDefaultChatRooms(): Promise<void> {
    // create default rooms only once
    const chatDocument = await this.chatModel.findOne();
    if (isEmpty(chatDocument?.rooms))
      await this.create({
        rooms: DEFAULT_CHAT_ROOMS,
      });
  }

  async create(chatInput: CreateChatRoomDTO): Promise<void> {
    await validate(chatInput, CreateChatRoomDTO);
    await this.chatModel.create(chatInput);
  }

  async getChatRooms(): Promise<ChatRoomsType[]> {
    const roomsDocument = await this.chatModel.findOne();
    return roomsDocument.rooms as ChatRoomsType[];
  }
}
