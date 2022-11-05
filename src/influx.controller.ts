import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { EnergyMeasurementService } from '@DB/influx/energy.measurement.service';

@Controller('time-series')
export class InfluxController {
  constructor(
    private readonly appService: AppService,
    private energyMeasurementService: EnergyMeasurementService,
  ) { }

  @Get()
  async getRangeOfData() {
    // const writeApi = this.energyMeasurementService.writeEnergyToDB();

    return this.energyMeasurementService.readEnergyFromDB();
  }

  @Get('aggregatedData/:duration')
  async getAggregatedData(@Param('duration') duration) {
    return this.energyMeasurementService.aggregateDataBasedOnTime(duration);
  }
}
