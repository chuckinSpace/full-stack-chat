import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Entry point, Input dto will validate for null and others.
  @Get('rooms')
  async getRooms() {
    return await this.chatService.getChatRooms();
  }
}
