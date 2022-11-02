import {
  FluxResultObserver,
  InfluxDB,
  Point,
  QueryApi,
  WriteApi,
} from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@sysConfig/config';

@Injectable()
export class InfluxService {
  constructor(private configService: ConfigService) {
    this.initInfluxDB();
  }

  influxDB: InfluxDB;
  writeApi: WriteApi;
  queryApi: QueryApi;

  initInfluxDB() {
    this.influxDB = new InfluxDB({
      url: this.configService.influxURL,
      token: this.configService.influxToken,
    });

    this.writeApi = this.influxDB.getWriteApi(
      this.configService.influxOrg,
      this.configService.influxBucket,
    );

    this.queryApi = this.influxDB.getQueryApi(this.configService.influxOrg);
  }

  queryData(fluxQuery: string, fluxObserver: FluxResultObserver<string[]>) {
    this.queryApi.queryRows(fluxQuery, fluxObserver);
  }

  writePointToDB(point: Point) {
    this.writeApi.writePoint(point);
  }

  writePointClose() {
    this.writeApi.close().then(() => {
      console.log('WRITE FINISHED');
    });
  }
}
