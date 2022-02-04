import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { ChatRoomsType } from 'src/chat/enums/chat-rooms-type.enum';
import { UpdateMessageDTO } from './dtos/update-message.dto';
import { MessageDocument } from './messages.schema';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}
  @Get()
  async getRoomMessages(
    @Query('room') room: string,
  ): Promise<MessageDocument[]> {
    return this.messageService.getRoomMessages(room as ChatRoomsType);
  }
  @Delete()
  async deleteMessage(
    @Query('userId') userId: string,
    @Query('messageId') messageId: string,
  ) {
    return await this.messageService.delete(userId, messageId);
  }
  @Patch()
  async updateMessage(@Body() updateMessageInput: UpdateMessageDTO) {
    return await this.messageService.update(updateMessageInput);
  }
}
