import { InfluxModule } from '@DB/influx';
import { Module } from '@nestjs/common';
import { SocketConnectionModule } from '@socket/socket-connection';
import { ConfigModule } from '@sysConfig/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, InfluxModule, SocketConnectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
