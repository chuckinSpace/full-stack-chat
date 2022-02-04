import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessageModel, MessageSchema } from './messages.schema';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageModel.name, schema: MessageSchema },
    ]),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
