import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsType } from '../chat/enums/chat-rooms-type.enum';
import { UpdateMessageDTO } from './dtos/update-message.dto';
import { MessagesController } from './messages.controller';
import { mockMessageService } from './messages.mocks';
import { MessageDocument } from './messages.schema';
import { MessagesService } from './messages.service';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService],
      controllers: [MessagesController],
    })
      .overrideProvider(MessagesService)
      .useValue(mockMessageService)
      .compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getRoomMessages', () => {
    it('return array of chat messages', async () => {
      expect.assertions(3);
      // assemble
      const testMessages = [
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
      ] as MessageDocument[];
      const spyGetRoomMessages = jest
        .spyOn(mockMessageService, 'getRoomMessages')
        .mockResolvedValue(testMessages);

      // act
      const res = await controller.getRoomMessages(ChatRoomsType.GENERAL);

      // assert
      expect(res).toEqual(testMessages);
      expect(spyGetRoomMessages).toHaveBeenCalledTimes(1);
      expect(spyGetRoomMessages).toHaveBeenCalledWith(ChatRoomsType.GENERAL);
    });
  });
  describe('deleteMessage', () => {
    it('deletes a chat message', async () => {
      expect.assertions(2);
      // assemble
      const validInput = {
        messageId: '123',
        userId: 'Batman',
      };

      const spyDelete = jest
        .spyOn(mockMessageService, 'delete')
        .mockResolvedValue(undefined);

      // act
      await controller.deleteMessage(validInput.userId, validInput.userId);

      // assert
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith(
        validInput.userId,
        validInput.userId,
      );
    });
  });
  describe('updateMessage', () => {
    it('updates a chat message', async () => {
      expect.assertions(2);
      // assemble
      const validInput: UpdateMessageDTO = {
        messageId: '123',
        userId: 'Batman',
        newMessage: 'valid new message',
      };

      const spyUpdate = jest
        .spyOn(mockMessageService, 'update')
        .mockResolvedValue(undefined);

      // act
      await controller.updateMessage(validInput);

      // assert
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(validInput);
    });
  });
});
