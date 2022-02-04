import { Test, TestingModule } from '@nestjs/testing';
import 'jest-matcher-specific-error';
import { ChatController } from './chat.controller';
import { mockChatService } from './chat.mocks';
import { ChatService } from './chat.service';
import { ChatRoomsType } from './enums/chat-rooms-type.enum';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    })
      .overrideProvider(ChatService)
      .useValue(mockChatService)
      .compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getRooms', () => {
    it('return array of chat rooms', async () => {
      expect.assertions(3);
      // assemble
      const mockChatRooms: ChatRoomsType[] = [
        ChatRoomsType.GENERAL,
        ChatRoomsType.TECHY_FELLOWS,
      ];
      const spyGetChatRooms = jest
        .spyOn(mockChatService, 'getChatRooms')
        .mockResolvedValue(mockChatRooms);

      // act
      const res = await controller.getRooms();

      // assert
      expect(res).toEqual(mockChatRooms);
      expect(spyGetChatRooms).toHaveBeenCalledTimes(1);
      expect(spyGetChatRooms).toHaveBeenCalledWith();
    });
  });
});
