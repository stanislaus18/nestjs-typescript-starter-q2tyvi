import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get influxURL() {
    return 'https://westeurope-1.azure.cloud2.influxdata.com/'; //
  }

  get influxToken() {
    return 'YjsElwXP78io40IU8mW7nQ1jGuTVUyrFtMW94IVdh9GCyw98Em7CPxwqR-tgZoDnh5s6FNzyHF5D2yqA3a0WAA==';
  }

  get influxOrg() {
    return 'BM';
  }

  get influxBucket() {
    return 'hackathon-JDD';
  }
}
