import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from './mongo.config.enum';
import { DEFAULT_MONGODB_URI } from './mongo.defaults';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          MongoConfig.MONGODB_URI,
          DEFAULT_MONGODB_URI,
        ),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
