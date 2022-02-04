import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMessageDTO } from 'src/messages/dtos/update-message.dto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ChatRoomsType } from './../src/chat/enums/chat-rooms-type.enum';
import { IMessage } from './../src/messages/interfaces/message.interface';
import { MessagesService } from './../src/messages/messages.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let messageService: MessagesService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    messageService = moduleFixture.get<MessagesService>(MessagesService);
    await app.init();
  });

  describe('ChatController', () => {
    it('(GET) 200 /chat/rooms,                            return array of default rooms', async () => {
      return await request(app.getHttpServer())
        .get('/chat/rooms')
        .set('Accept', 'application/json')
        .expect(200)
        .expect([ChatRoomsType.GENERAL, ChatRoomsType.TECHY_FELLOWS]);
    });
  });
  describe('MessagesController', () => {
    it('(GET) 200 /messages?room=GENERAL                   gets default rooms messages', async () => {
      const testMessages: IMessage[] = [
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
      ];
      const res = await request(app.getHttpServer())
        .get('/messages?room=GENERAL')
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).toMatchObject(testMessages);
    });
    it('(GET) 400 /messages?room=                          rejects empty input', async () => {
      return await request(app.getHttpServer())
        .get('/messages?room=')
        .set('Accept', 'application/json')
        .expect(400);
    });
    it('(GET) 400 /messages?room=INVALID_ROOM_TYPE         rejects invalid input', async () => {
      return await request(app.getHttpServer())
        .get('/messages?room=INVALID_ROOM_TYPE')
        .set('Accept', 'application/json')
        .expect(400);
    });
    it('(DELETE) 200 /messages?userId=123&messageId=333    deletes messages', async () => {
      const messages = await messageService.getRoomMessages(
        ChatRoomsType.GENERAL,
      );
      const testMessage = messages[1];

      await request(app.getHttpServer())
        .delete(
          `/messages?userId=${testMessage.userId}&messageId=${testMessage.id}`,
        )
        .set('Accept', 'application/json')
        .expect(200);

      // Put message back on database
      await messageService.createMessage({
        message: testMessage.message,
        room: testMessage.room,
        userId: testMessage.userId,
      });
    });
    it('(DELETE) 400 /messages?userId=invalidId&messageId= reject invalid input', async () => {
      await request(app.getHttpServer())
        .delete('/messages?userId=invalidId&messageId=')
        .set('Accept', 'application/json')
        .expect(400);
    });
    it('(PATCH) 200  /messages                             updates messages', async () => {
      const messages = await messageService.getRoomMessages(
        ChatRoomsType.GENERAL,
      );
      const testMessage = messages[0];
      const body: UpdateMessageDTO = {
        userId: testMessage.userId,
        messageId: testMessage.id,
        newMessage: 'valid new message',
      };
      await request(app.getHttpServer())
        .patch('/messages')
        .send(body)
        .set('Accept', 'application/json')
        .expect(200);

      // Put message back on database
      await messageService.update({
        newMessage: testMessage.message,
        userId: testMessage.userId,
        messageId: testMessage.id,
      });
    });
    it('(PATCH) 400  /messages                             reject invalid input', async () => {
      const body: UpdateMessageDTO = {
        userId: 'invalidId',
        messageId: 'invalidId',
        newMessage: undefined,
      };
      await request(app.getHttpServer())
        .patch('/messages')
        .send(body)
        .set('Accept', 'application/json')
        .expect(400);
    });
  });
});
