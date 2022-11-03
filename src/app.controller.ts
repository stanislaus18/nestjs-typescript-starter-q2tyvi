import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EnergyMeasurementService } from '@DB/influx/energy.measurement.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private energyMeasurementService: EnergyMeasurementService,
  ) {}

  @Get()
  getHello(): string {
    // const writeApi = this.energyMeasurementService.writeEnergyToDB();

   // this.energyMeasurementService.readEnergyFromDB();

    return this.appService.getHello();
  }
}
