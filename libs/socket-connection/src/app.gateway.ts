import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { IOT_DATA, IOT_DATA_LIST } from './iot-constants';
import { UserSessionCache } from './user-session-cache';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userSessionCache: UserSessionCache) {
    this.sendMessages();
  }

  @WebSocketServer() server: Server;

  // watt value
  private acWatt = 20;
  private tvWatt = 5;
  private lightWatt = 1;
  private fridgeWatt = 10;

  private acData = 0;
  private tvData = 0;
  private lightsData = 0;
  private fridgeData = 0;

  private timestamp: string;

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

    this.serverEmitSwitch('AC_SWITCH', data);

    if (data) {
      console.log(data);
      if (data.value) {
        this.acData = this.acData + 1;
      }

      if (!data.value) {
        this.acData = this.acData - 1;
      }
      // User as switched ON the AC
      // add the data in TimeSeries Current Energy + AC Energy
    }
  }

  @SubscribeMessage('TV')
  public async tv(client: Socket, data: { name: string; value: boolean }) {
    client.join('TV');

    this.serverEmitSwitch('TV_SWITCH', data);

    if (data) {
      console.log(data);
      if (data.value) {
        this.tvData = this.tvData + 1;
      }

      if (!data.value) {
        this.tvData = this.tvData - 1;
      }
      // User as switched ON the TV
      // add the data in TimeSeries Current Energy + TV Energy
    }
  }

  @SubscribeMessage('LIGHTS')
  public async lights(client: Socket, data: { name: string; value: boolean }) {
    client.join('LIGHTS');

    this.serverEmitSwitch('LIGHTS_SWITCH', data);

    if (data) {
      console.log(data);

      if (data.value) {
        this.lightsData = this.lightsData + 1;
      }

      if (!data.value) {
        this.lightsData = this.lightsData - 1;
      }
      // User as switched ON the LIGHTS
      // add the data in TimeSeries Current Energy + LIGHTS Energy
    }
  }

  @SubscribeMessage('FRIDGE')
  public async fridge(client: Socket, data: { name: string; value: boolean }) {
    client.join('FRIDGE');

    this.serverEmitSwitch('FRIDGE_SWITCH', data);

    if (data) {
      console.log(data);

      if (data.value) {
        this.fridgeData = this.fridgeData + 1;
      }

      if (!data.value) {
        this.fridgeData = this.fridgeData - 1;
      }
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
      const date = new Date();
      if (date.toLocaleString() === this.timestamp) {
        return;
      }

      this.timestamp = date.toLocaleString();

      IOT_DATA_LIST.forEach((iot: string) => {
        this.serverEmit(iot);
      });

      // console.log(this.timestamp);
    }, 2000);
  }

  getEnergyValue(type: string) {
    let value = Math.random() * 4;

    if (this.acData > 0) {
      const watt =
        Math.random() * (this.acWatt - (this.acWatt - 4) + 1) + this.acWatt;
      value = value + this.acData * watt;
      if (type === 'AC') {
        return this.acData * watt;
      }
    }
    if (this.tvData > 0) {
      const watt =
        Math.random() * (this.tvWatt - (this.tvWatt - 2) + 1) + this.tvWatt;

      value = value + this.tvData * watt;
      if (type === 'TV') {
        return this.tvData * watt;
      }
    }
    if (this.fridgeData > 0) {
      const watt =
        Math.random() * (this.fridgeData - (this.fridgeData - 4) + 1) +
        this.fridgeData;

      value = value + this.fridgeData * watt;
      if (type === 'FRIDGE') {
        return this.fridgeData * watt;
      }
    }
    if (this.lightsData > 0) {
      const watt =
        Math.random() * (this.lightWatt - (this.lightWatt - 1) + 1) +
        this.lightWatt;

      value = value + this.lightsData * watt;
      if (type === 'LIGHTS') {
        return this.lightsData * watt;
      }
    }

    // console.log('Total Energy : ', value);
    return value;
  }

  serverEmit(type: string) {
    if (this.acData <= 0 && type === 'AC') {
      return;
    }

    if (this.tvData <= 0 && type === 'TV') {
      return;
    }

    if (this.fridgeData <= 0 && type === 'FRIDGE') {
      return;
    }

    if (this.lightsData <= 0 && type === 'LIGHTS') {
      return;
    }

    const value = this.getEnergyValue(type);

    this.server.emit(type, {
      timestamp: new Date(),
      value,
    });
  }

  serverEmitSwitch(type: string, data: any) {
    this.server.emit(type, data);
  }
}
