import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChatRoomsType } from '../chat/enums/chat-rooms-type.enum';
import { IMessage } from './interfaces/message.interface';

export type MessageDocument = MessageModel & Document;

@Schema({
  collection: 'messages',
  timestamps: true,
  id: true,
})
export class MessageModel implements IMessage {
  id: string;

  @Prop({ required: true })
  room: ChatRoomsType;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
