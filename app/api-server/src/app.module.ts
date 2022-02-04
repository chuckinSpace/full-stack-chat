import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { MongoModule } from './mongo/mongo.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ChatModule, MongoModule, MessagesModule],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
