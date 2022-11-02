import { Module } from '@nestjs/common';
import { ConfigModule } from '@sysConfig/config';
import { EnergyMeasurementService } from './energy.measurement.service';
import { InfluxService } from './influx.service';

@Module({
  imports: [ConfigModule],
  providers: [InfluxService, EnergyMeasurementService],
  exports: [EnergyMeasurementService],
})
export class InfluxModule {}
