import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from '../messages/messages.module';
import { ChatController } from './chat.controller';
import { ChatModel, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatModel.name, schema: ChatSchema }]),
    MessagesModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
