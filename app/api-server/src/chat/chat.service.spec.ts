import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import 'jest-matcher-specific-error';
import { mockChatModel } from './chat.mocks';
import { ChatDocument, ChatModel } from './chat.schema';
import { ChatService } from './chat.service';
import { CreateChatRoomDTO } from './dtos/create-room.dto';
import { ChatRoomsType } from './enums/chat-rooms-type.enum';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(ChatModel.name),
          useValue: mockChatModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createDefaultChatRooms', () => {
    it('Create default rooms when collection is empty', async () => {
      expect.assertions(2);
      // assemble
      const spyFindOne = jest
        .spyOn(mockChatModel, 'findOne')
        .mockResolvedValue([]);
      const spyCreate = jest
        .spyOn(mockChatModel, 'create')
        .mockResolvedValue(undefined);
      // act
      await service.createDefaultChatRooms();

      // assert
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledTimes(1);
    });
    it('Does not create default rooms when already created', async () => {
      expect.assertions(2);
      // assemble
      const chatObject: ChatModel = {
        id: '312333',
        rooms: [ChatRoomsType.GENERAL, ChatRoomsType.TECHY_FELLOWS],
      };

      const spyFindOne = jest
        .spyOn(mockChatModel, 'findOne')
        .mockResolvedValue(chatObject);
      const spyCreate = jest
        .spyOn(mockChatModel, 'create')
        .mockResolvedValue(undefined);
      // act
      await service.createDefaultChatRooms();

      // assert
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledTimes(0);
    });
  });
  describe('create', () => {
    it('rejects empty input', async () => {
      expect.assertions(2);
      // arrange
      const spyCreate = jest
        .spyOn(mockChatModel, 'create')
        .mockResolvedValue(undefined);
      const invalidInput = {} as CreateChatRoomDTO;
      // act
      await expect(service.create(invalidInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: ['rooms should not be null or undefined'],
          error: 'Bad Request',
        }),
      );
      // assert
      expect(spyCreate).toHaveBeenCalledTimes(0);
    });
    it('creates a chat room', async () => {
      expect.assertions(2);
      // arrange
      const spyCreate = jest
        .spyOn(mockChatModel, 'create')
        .mockResolvedValue(undefined);
      const validInput: CreateChatRoomDTO = {
        rooms: [ChatRoomsType.GENERAL, ChatRoomsType.TECHY_FELLOWS],
      };
      // act
      await service.create(validInput);

      // assert
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(validInput);
    });
  });
  describe('getChatRooms', () => {
    it('returns an array of chat rooms', async () => {
      expect.assertions(2);
      // arrange
      const mockChatRooms = {
        id: '123',
        rooms: [ChatRoomsType.GENERAL, ChatRoomsType.TECHY_FELLOWS],
      } as ChatDocument;

      const spyFindOne = jest
        .spyOn(mockChatModel, 'findOne')
        .mockResolvedValue(mockChatRooms);

      // act
      const res = await service.getChatRooms();

      // assert
      expect(res).toEqual(mockChatRooms.rooms);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
    });
  });
});
