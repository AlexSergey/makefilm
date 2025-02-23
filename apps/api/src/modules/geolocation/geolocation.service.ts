import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { IP2Location } from 'ip2location-nodejs';

@Injectable()
export class GeolocationService implements OnApplicationShutdown, OnModuleInit {
  public ip2location: IP2Location;

  getLatLngFromIp(ip: string): { lat: string; lng: string } {
    const res = this.ip2location.getAll(ip) as {
      latitude: string;
      longitude: string;
    };

    const lat = isNaN(Number(res.latitude)) ? '41.40338' : res.latitude;
    const lng = isNaN(Number(res.longitude)) ? '2.17403' : res.longitude;

    return {
      lat,
      lng,
    };
  }

  onApplicationShutdown(): void {
    this.ip2location.close();
  }

  onModuleInit(): void {
    const bin = process.cwd() + '/bin/IP2LOCATION-LITE-DB5.BIN';

    if (!this.ip2location) {
      this.ip2location = new IP2Location();

      this.ip2location.open(bin);
    }
  }
}
