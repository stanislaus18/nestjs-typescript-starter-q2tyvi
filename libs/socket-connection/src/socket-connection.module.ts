import { CacheModule, Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { SocketConnectionService } from './socket-connection.service';
import { UserSessionCache } from './user-session-cache';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [SocketConnectionService, AppGateway, UserSessionCache],
  exports: [SocketConnectionService],
})
export class SocketConnectionModule {}
