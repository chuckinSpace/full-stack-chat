import { IMessageService } from './interfaces/messages.service.interface';

export const mockMessageService: IMessageService = {
  createTestingMessages: jest.fn(),
  createMessage: jest.fn(),
  getRoomMessages: jest.fn(),
  getMessage: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};
export const mockMessageModel = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};
