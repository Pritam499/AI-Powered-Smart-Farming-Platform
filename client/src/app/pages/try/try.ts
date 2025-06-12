// // src/app/pages/try/try.component.ts
// import { Component, signal } from '@angular/core';
// import { CommonModule }         from '@angular/common';
// import { FormsModule }          from '@angular/forms';
// import { Router }               from '@angular/router';

// import { FileUploadComponent }  from '../../shared/ui/file-upload/file-upload';
// import { DiseaseService }       from '../../services/disease.service';
// import { IpService }            from '../../services/ip.service';
// import { DiseaseResponse }      from '../../models';

// @Component({
//   standalone: true,
//   selector: 'app-try',
//   imports: [CommonModule, FormsModule, FileUploadComponent],
//   templateUrl: './try.component.html',
//   styleUrls: ['./try.component.css'],
// })
// export class TryComponent {
//   selectedFile?: File;
//   crop = '';
//   prediction = signal<DiseaseResponse | null>(null);
//   loading    = signal(false);
//   tried      = signal(false);

//   constructor(
//     private ds: DiseaseService,
//     private ip: IpService,
//     private router: Router
//   ) {
//     // use the hasTriedBefore() method
//     this.ip.hasTriedBefore().subscribe(res => {
//       this.tried.set(res.hasTried);
//     });
//   }

//   onFile(file: File) {
//     this.selectedFile = file;
//     this.prediction.set(null);
//   }

//   submit() {
//     if (!this.selectedFile || !this.crop) return;

//     this.loading.set(true);

//     this.ds.predictDisease(this.selectedFile, this.crop)
//       .subscribe({
//         next: (res: DiseaseResponse) => {
//           // res is typed correctly
//           this.prediction.set(res);
//           this.loading.set(false);

//           if (this.tried()) {
//             this.router.navigate(['/signup'], {
//               state: { message: 'Please sign up to continue.' }
//             });
//           }
//         },
//         error: () => {
//           this.loading.set(false);
//           // you could set an error signal here if you have one
//         }
//       });
//   }
// }




// src/app/pages/try/try.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { Router }               from '@angular/router';

import { FileUploadComponent }  from '../../shared/ui/file-upload/file-upload';
import { DiseaseService }       from '../../services/disease.service';
import { IpService }            from '../../services/ip.service';
import { DiseaseResponse }      from '../../models';

@Component({
  standalone: true,
  selector: 'app-try',
  imports: [CommonModule, FormsModule, FileUploadComponent],
  templateUrl: './try.html',
  styleUrls: ['./try.css'],
})
export class TryComponent {
  selectedFile?: File;
  crop = '';
  prediction = signal<DiseaseResponse | null>(null);
  loading    = signal(false);
  tried      = signal(false);

  constructor(
    private ds: DiseaseService,
    private ip: IpService,
    private router: Router
  ) {
    // use ip.check() and type the response
    this.ip.check().subscribe((res: { hasTried: boolean }) => {
      this.tried.set(res.hasTried);
    });
  }

  onFile(file: File) {
    this.selectedFile = file;
    this.prediction.set(null);
  }

  submit() {
    if (!this.selectedFile || !this.crop) return;

    this.loading.set(true);

    this.ds.predictDisease(this.selectedFile, this.crop)
      .subscribe({
        next: (res: DiseaseResponse) => {
          this.prediction.set(res);
          this.loading.set(false);

          if (this.tried()) {
            this.router.navigate(['/signup'], {
              state: { message: 'Please sign up to continue.' }
            });
          }
        },
        error: () => {
          this.loading.set(false);
          // you can surface an error message here if you like
        }
      });
  }
}
