import { Module } from '@nestjs/common';

import { GeolocationService } from './geolocation.service';

@Module({
  imports: [],
  providers: [GeolocationService],
})
export class GeolocationModule {}
