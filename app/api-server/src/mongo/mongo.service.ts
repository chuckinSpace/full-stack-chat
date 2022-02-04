import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoService {
  constructor(@InjectConnection() private readonly connection: Connection) {
    this.connection = connection;
  }

  getConnection(): Connection {
    return this.connection;
  }
}
