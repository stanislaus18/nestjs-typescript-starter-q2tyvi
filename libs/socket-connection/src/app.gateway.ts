import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserSessionCache } from './user-session-cache';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userSessionCache: UserSessionCache) {
    this.sendMessages();
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('messages')
  public async messages(client: Socket, userName: string) {
    client.join('ENERGY');
    // this.userSessionCache.addOrUpdate(userName);
    // const activeUsers = await this.userSessionCache.getAllActive();
  }

  @SubscribeMessage('ENERGY')
  public async energyData(client: Socket) {
    client.join('ENERGY');
    // this.userSessionCache.addOrUpdate(userName);
    // const activeUsers = await this.userSessionCache.getAllActive();
  }

  @SubscribeMessage('AC')
  public async ac(client: Socket, data: { name: string; value: boolean }) {
    client.join('AC');

    if (data) {
      console.log(data);
      // User as switched ON the AC
      // add the data in TimeSeries Current Energy + AC Energy
    }
  }

  @SubscribeMessage('TV')
  public async tv(client: Socket, data: { name: string; value: boolean }) {
    client.join('TV');

    if (data) {
      console.log(data);
      // User as switched ON the TV
      // add the data in TimeSeries Current Energy + TV Energy
    }
  }

  @SubscribeMessage('LIGHTS')
  public async lights(client: Socket, data: { name: string; value: boolean }) {
    client.join('LIGHTS');

    if (data) {
      console.log(data);
      // User as switched ON the LIGHTS
      // add the data in TimeSeries Current Energy + LIGHTS Energy
    }
  }

  @SubscribeMessage('FRIDGE')
  public async fridge(client: Socket, data: { name: string; value: boolean }) {
    client.join('FRIDGE');

    if (data) {
      console.log(data);
      // User as switched ON the FRIDGE
      // add the data in TimeSeries Current Energy + FRIDGE Energy
    }
  }

  subscribeEnergyValues(type: string) {
    setInterval(() => {
      this.server.emit(type, new Date());
    }, 1000);

    // setInterval(() => {
    //   this.server.emit(type, <data>);
    // }, 1000);
  }

  sendMessages() {
    setInterval(() => {
      this.mockData();
    }, 1000);
  }

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  mockData() {
    setInterval(() => {
      this.server.emit('ENERGY', {
        timestamp: new Date(),
        value: Math.random() * (80 - 50 + 1) + 50,
      });
    }, 1000);
  }
}
