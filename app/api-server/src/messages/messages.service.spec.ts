import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import 'jest-matcher-specific-error';
import { ChatRoomsType } from '../chat/enums/chat-rooms-type.enum';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { UpdateMessageDTO } from './dtos/update-message.dto';
import { IMessage } from './interfaces/message.interface';
import { mockMessageModel } from './messages.mocks';
import { MessageDocument, MessageModel } from './messages.schema';
import { MessagesService } from './messages.service';
describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getModelToken(MessageModel.name),
          useValue: mockMessageModel,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createTestingMessages', () => {
    it('create testing messages if collection is empty', async () => {
      expect.assertions(3);
      // assemble
      const mockTestMessages: IMessage[] = [
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
        {
          message: 'We are all techy people here',
          room: ChatRoomsType.TECHY_FELLOWS,
          userId: 'Elon is a Must',
        },
        {
          message: 'I think i just hacked NASA',
          room: ChatRoomsType.TECHY_FELLOWS,
          userId: 'HuCker',
        },
      ];
      const spyFind = jest
        .spyOn(mockMessageModel, 'find')
        .mockResolvedValue([]);
      const spyCreate = jest
        .spyOn(mockMessageModel, 'create')
        .mockResolvedValue(undefined);

      // act
      await service.createTestingMessages();

      // assert
      expect(spyFind).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockTestMessages);
    });
    it('Does not create default testing messages when already created', async () => {
      expect.assertions(2);
      // assemble
      const mockTestMessages: IMessage[] = [
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
        {
          message: 'We are all techy people here',
          room: ChatRoomsType.TECHY_FELLOWS,
          userId: 'Elon is a Must',
        },
        {
          message: 'I think i just hacked NASA',
          room: ChatRoomsType.TECHY_FELLOWS,
          userId: 'HuCker',
        },
      ];

      const spyFind = jest
        .spyOn(mockMessageModel, 'find')
        .mockResolvedValue(mockTestMessages);
      const spyCreate = jest
        .spyOn(mockMessageModel, 'create')
        .mockResolvedValue(undefined);
      // act
      await service.createTestingMessages();

      // assert
      expect(spyFind).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledTimes(0);
    });
  });
  describe('createMessage', () => {
    it('reject empty input', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const emptyInput = {} as CreateMessageDTO;
      const spyCreate = jest
        .spyOn(mockMessageModel, 'create')
        .mockResolvedValue({} as MessageDocument);

      // act
      await expect(service.createMessage(emptyInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: [
            'room should not be null or undefined',
            'userId should not be null or undefined',
            'message should not be null or undefined',
          ],
          error: 'Bad Request',
        }),
      );

      expect(spyCreate).toHaveBeenCalledTimes(0);
    });
    it('reject invalid input', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const emptyInput = {
        message: '',
        room: '' as ChatRoomsType,
        userId: '',
      } as CreateMessageDTO;
      const spyCreate = jest
        .spyOn(mockMessageModel, 'create')
        .mockResolvedValue({} as MessageDocument);

      // act
      await expect(service.createMessage(emptyInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: [
            'room must be a valid enum value',
            'userId should not be empty',
            'message should not be empty',
          ],
          error: 'Bad Request',
        }),
      );

      expect(spyCreate).toHaveBeenCalledTimes(0);
    });
    it('creates a message', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const validInput = {
        message: 'Valid test message',
        room: ChatRoomsType.GENERAL,
        userId: 'Valid_username',
      } as CreateMessageDTO;
      const spyCreate = jest
        .spyOn(mockMessageModel, 'create')
        .mockResolvedValue(undefined);

      // act
      await service.createMessage(validInput);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(validInput);
    });
  });
  describe('getRoomMessages', () => {
    it('reject empty input', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const emptyInput = '' as ChatRoomsType;
      const spyFind = jest
        .spyOn(mockMessageModel, 'find')
        .mockResolvedValue([]);

      // act
      await expect(service.getRoomMessages(emptyInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: ['room must be a valid enum value'],
          error: 'Bad Request',
        }),
      );

      expect(spyFind).toHaveBeenCalledTimes(0);
    });
    it('reject invalid input', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const emptyInput = 'invalidType' as ChatRoomsType;
      const spyFind = jest
        .spyOn(mockMessageModel, 'find')
        .mockResolvedValue([]);

      // act
      await expect(service.getRoomMessages(emptyInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: ['room must be a valid enum value'],
          error: 'Bad Request',
        }),
      );

      expect(spyFind).toHaveBeenCalledTimes(0);
    });
    it('get an array of messages', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const emptyInput = ChatRoomsType.GENERAL;
      const mockMessages: IMessage[] = [
        {
          message: 'Test message',
          room: ChatRoomsType.GENERAL,
          userId: 'test_username',
        },
      ];
      const spyFind = jest
        .spyOn(mockMessageModel, 'find')
        .mockResolvedValue(mockMessages);

      // act
      const res = await service.getRoomMessages(emptyInput);
      expect(res).toEqual(mockMessages);
      expect(spyFind).toHaveBeenCalledTimes(1);
      expect(spyFind).toHaveBeenCalledWith({ room: emptyInput });
    });
  });
  describe('getMessage', () => {
    it('reject empty input', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const emptyInput = '';
      const spyFindById = jest
        .spyOn(mockMessageModel, 'findById')
        .mockResolvedValue([]);

      // act
      await expect(service.getMessage(emptyInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: ['messageId should not be empty'],
          error: 'Bad Request',
        }),
      );

      expect(spyFindById).toHaveBeenCalledTimes(0);
    });
    it('reject invalid input', async () => {
      // assert
      expect.assertions(2);
      // assemble
      const nullInput = null;
      const spyFindById = jest
        .spyOn(mockMessageModel, 'findById')
        .mockResolvedValue([]);

      // act
      await expect(service.getMessage(nullInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: ['messageId should not be null or undefined'],
          error: 'Bad Request',
        }),
      );

      expect(spyFindById).toHaveBeenCalledTimes(0);
    });
    it('gets one message by id', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const validInput = '1234';
      const mockMessage = {
        message: 'Test message',
        room: ChatRoomsType.GENERAL,
        userId: 'test_username',
      } as MessageDocument;

      const spyFindById = jest
        .spyOn(mockMessageModel, 'findById')
        .mockResolvedValue(mockMessage);

      // act
      const res = await service.getMessage(validInput);
      expect(res).toEqual(mockMessage);
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(validInput);
    });
  });
  describe('delete', () => {
    it('reject empty input', async () => {
      // assert
      expect.assertions(3);
      // assemble

      const spyFindByIdAndDelete = jest
        .spyOn(mockMessageModel, 'findByIdAndDelete')
        .mockResolvedValue([]);
      const spyGetMessage = jest.spyOn(service, 'getMessage');

      // act
      await expect(service.delete('', '')).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: [
            'userId should not be empty',
            'messageId should not be empty',
          ],
          error: 'Bad Request',
        }),
      );

      expect(spyFindByIdAndDelete).toHaveBeenCalledTimes(0);
      expect(spyGetMessage).toHaveBeenCalledTimes(0);
    });
    it('reject invalid input', async () => {
      // assert
      expect.assertions(3);
      // assemble

      const spyFindByIdAndDelete = jest
        .spyOn(mockMessageModel, 'findByIdAndDelete')
        .mockResolvedValue([]);
      const spyGetMessage = jest.spyOn(service, 'getMessage');

      // act
      await expect(service.delete(null, undefined)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: [
            'userId should not be null or undefined',
            'messageId should not be null or undefined',
          ],
          error: 'Bad Request',
        }),
      );

      expect(spyFindByIdAndDelete).toHaveBeenCalledTimes(0);
      expect(spyGetMessage).toHaveBeenCalledTimes(0);
    });
    it('deletes the message', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const validInput: UpdateMessageDTO = {
        messageId: '123',
        newMessage: 'new message text',
        userId: 'test_username',
      };
      const mockMessageDocument = {
        room: ChatRoomsType.GENERAL,
        userId: 'test_username',
        message: 'old message',
        id: '123',
      } as MessageDocument;

      const spyFindByIdAndDelete = jest
        .spyOn(mockMessageModel, 'findByIdAndDelete')
        .mockResolvedValue(validInput);
      const spyGetMessage = jest
        .spyOn(service, 'getMessage')
        .mockResolvedValue(mockMessageDocument);

      // act
      const res = await service.delete(validInput.userId, validInput.messageId);
      expect(res).toEqual(validInput);
      expect(spyFindByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(spyGetMessage).toHaveBeenCalledTimes(1);
    });
    it('does not delete the message if user is not owner', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const validInput: UpdateMessageDTO = {
        messageId: '123',
        newMessage: 'new message text',
        userId: 'test_wrong_username',
      };
      const mockMessageDocument = {
        room: ChatRoomsType.GENERAL,
        userId: 'test_username',
        message: 'old message',
        id: '123',
      } as MessageDocument;

      const spyFindByIdAndDelete = jest
        .spyOn(mockMessageModel, 'findByIdAndDelete')
        .mockResolvedValue(validInput);
      const spyGetMessage = jest
        .spyOn(service, 'getMessage')
        .mockResolvedValue(mockMessageDocument);

      // act
      await expect(service.update(validInput)).rejects.toMatchError(
        new UnauthorizedException({
          statusCode: 401,
          message: 'Unauthorized',
        }),
      );
      expect(spyFindByIdAndDelete).toHaveBeenCalledTimes(0);
      expect(spyGetMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('reject empty input', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const emptyInput = {} as UpdateMessageDTO;
      const spyFindByIdAndUpdate = jest
        .spyOn(mockMessageModel, 'findByIdAndUpdate')
        .mockResolvedValue([]);
      const spyGetMessage = jest.spyOn(service, 'getMessage');

      // act
      await expect(service.update(emptyInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: [
            'userId should not be null or undefined',
            'messageId should not be null or undefined',
            'newMessage should not be null or undefined',
          ],
          error: 'Bad Request',
        }),
      );

      expect(spyFindByIdAndUpdate).toHaveBeenCalledTimes(0);
      expect(spyGetMessage).toHaveBeenCalledTimes(0);
    });
    it('reject invalid input', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const invalidInput = {
        messageId: null,
        newMessage: null,
        userId: undefined,
      } as UpdateMessageDTO;
      const spyFindByIdAndUpdate = jest
        .spyOn(mockMessageModel, 'findByIdAndUpdate')
        .mockResolvedValue([]);
      const spyGetMessage = jest.spyOn(service, 'getMessage');
      // act
      await expect(service.update(invalidInput)).rejects.toMatchError(
        new BadRequestException({
          statusCode: 400,
          message: [
            'userId should not be null or undefined',
            'messageId should not be null or undefined',
            'newMessage should not be null or undefined',
          ],
          error: 'Bad Request',
        }),
      );

      expect(spyFindByIdAndUpdate).toHaveBeenCalledTimes(0);
      expect(spyGetMessage).toHaveBeenCalledTimes(0);
    });
    it('updates message', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const validInput: UpdateMessageDTO = {
        messageId: '123',
        newMessage: 'new message text',
        userId: 'test_username',
      };
      const mockMessageDocument = {
        room: ChatRoomsType.GENERAL,
        userId: 'test_username',
        message: 'old message',
        id: '123',
      } as MessageDocument;

      const spyFindByIdAndUpdate = jest
        .spyOn(mockMessageModel, 'findByIdAndUpdate')
        .mockResolvedValue(validInput);
      const spyGetMessage = jest
        .spyOn(service, 'getMessage')
        .mockResolvedValue(mockMessageDocument);

      // act
      const res = await service.update(validInput);
      expect(res).toEqual(validInput);
      expect(spyFindByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(spyGetMessage).toHaveBeenCalledTimes(1);
    });
    it('does not update when user is not owner', async () => {
      // assert
      expect.assertions(3);
      // assemble
      const validInput: UpdateMessageDTO = {
        messageId: '123',
        newMessage: 'new message text',
        userId: 'test_wrong_username',
      };
      const mockMessageDocument = {
        room: ChatRoomsType.GENERAL,
        userId: 'test_username',
        message: 'old message',
        id: '123',
      } as MessageDocument;
      const spyFindByIdAndUpdate = jest
        .spyOn(mockMessageModel, 'findByIdAndUpdate')
        .mockResolvedValue(validInput);
      const spyGetMessage = jest
        .spyOn(service, 'getMessage')
        .mockResolvedValue(mockMessageDocument);

      // act
      await expect(service.update(validInput)).rejects.toMatchError(
        new UnauthorizedException({
          statusCode: 401,
          message: 'Unauthorized',
        }),
      );
      expect(spyFindByIdAndUpdate).toHaveBeenCalledTimes(0);
      expect(spyGetMessage).toHaveBeenCalledTimes(1);
    });
  });
});
