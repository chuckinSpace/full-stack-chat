import { IChatGateway } from './interfaces/chat.gateway.interface';
import { IChatService } from './interfaces/chat.service.interface';

export const mockChatService: IChatService = {
  createDefaultChatRooms: jest.fn(),
  getChatRooms: jest.fn(),
  create: jest.fn(),
};

export const mockChatModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};
export const mockChatGateway: IChatGateway = {
  handleRefreshRoom: jest.fn(),
  handleMessage: jest.fn(),
  handleRoomJoin: jest.fn(),
  handleRoomLeave: jest.fn(),
};
