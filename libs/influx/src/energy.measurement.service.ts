import { Point } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@sysConfig/config';
import { InfluxService } from './influx.service';

@Injectable()
export class EnergyMeasurementService {
  constructor(
    private influxService: InfluxService,
    private configService: ConfigService,
  ) { }

  writeEnergyToDB(measurementName?: string) {
    this.influxService.initInfluxDB();

    const point = new Point('energy')
      .tag('building', 'floor-01')
      .floatField('value', 1); // in Watt

    this.influxService.writePointToDB(point);

    this.influxService.writePointClose();
  }

  async aggregateDataBasedOnTime(durations = '1d') {
    return new Promise((resolve, reject) => {
      const data = [];

      const fluxQuery = `from(bucket: "${this.configService.influxBucket}")
      |> range(start: -7d)
      |> filter(fn:(r) => r.building == "floor-00")
      |> filter(fn: (r) => r["_field"] == "_value")
      |> filter(fn: (r) => r._measurement == "energy")
      |> filter(fn: (r) => r["_value"] != "value")
      |> filter(fn: (r) => r["_value"] != "?")
      |> toFloat()
      |> window(every: ${durations})
      |> mean()
      `;

      const fluxObserver = {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          data.push(o);
        },
        error(error) {
          console.error(error);
          console.log('\nFinished ERROR');
        },
        complete() {
          resolve(data);
          console.log('\nFinished SUCCESS');
        },
      };
      this.influxService.queryData(fluxQuery, fluxObserver);
    });
  }

  async readEnergyFromDB() {
    return new Promise((resolve, reject) => {
      const data = [];
      const fluxQuery = `from(bucket: "${this.configService.influxBucket}")
      |> range(start: -7d)
      |> filter(fn:(r) => r.building == "floor-00")
      |> filter(fn: (r) => r["_field"] == "_value")
      |> filter(fn: (r) => r._measurement == "energy")`;

      const fluxObserver = {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          console.log(
            `${o._time} ${o._measurement} (${o.building}): ${o._field}=${o._value}`,
          );
          data.push(o);
        },
        error(error) {
          console.error(error);
          console.log('\nFinished ERROR');
        },
        complete() {
          resolve(data);
          console.log('\nFinished SUCCESS');
        },
      };

      this.influxService.queryData(fluxQuery, fluxObserver);
    });
  }
}
