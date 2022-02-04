import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChatRoomsType } from './enums/chat-rooms-type.enum';
import { IChat } from './interfaces/chat.interface';

export type ChatDocument = ChatModel & Document;

@Schema({
  collection: 'chat',
  timestamps: true,
  id: true,
})
export class ChatModel implements IChat {
  id: string;

  @Prop({ required: false })
  rooms: ChatRoomsType[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatModel);
