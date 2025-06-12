// import { Injectable } from '@angular/core';
// import { ApiService } from '../core/services/api.service';

// @Injectable({ providedIn: 'root' })
// export class IpService {
//   constructor(private api: ApiService) {}
//   check() {
//     return this.api.get<{ hasTried: boolean }>('/ip/check');
//   }
// }





// src/app/services/ip.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class IpService {
  constructor(private api: ApiService) {}

  // this is the right method name
  check() {
    return this.api.get<{ hasTried: boolean }>('/ip/check');
  }
}
