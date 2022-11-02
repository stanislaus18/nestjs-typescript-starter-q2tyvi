import { Point } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@sysConfig/config';
import { InfluxService } from './influx.service';

@Injectable()
export class EnergyMeasurementService {
  constructor(
    private influxService: InfluxService,
    private configService: ConfigService,
  ) {}

  writeEnergyToDB(measurementName?: String) {
    this.influxService.initInfluxDB();

    const point = new Point('energy')
      .tag('building', 'floor-01')
      .floatField('value', 1); // in Watt

    this.influxService.writePointToDB(point);

    this.influxService.writePointClose();
  }

  readEnergyFromDB() {
    const fluxQuery = `from(bucket: "${this.configService.influxBucket}")
      |> range(start: 1)
      |> filter(fn: (r) => r._measurement == "energy")`;

    const fluxObserver = {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        console.log(
          `${o._time} ${o._measurement} (${o.building}): ${o._field}=${o._value}`,
        );
      },
      error(error) {
        console.error(error);
        console.log('\nFinished ERROR');
      },
      complete() {
        console.log('\nFinished SUCCESS');
      },
    };

    this.influxService.queryData(fluxQuery, fluxObserver);
  }
}
