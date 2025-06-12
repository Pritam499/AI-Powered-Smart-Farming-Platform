// import { Component, EventEmitter, Output } from '@angular/core';

// @Component({
//   standalone: true,
//   selector: 'app-file-upload',
//   template: `
//     <div (click)="fileInput.click()" class="p-6 border-2 border-dashed rounded cursor-pointer hover:border-green-500">
//       <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFile($event)">
//       <p class="text-center text-gray-500">Click or drag image here</p>
//     </div>
//   `
// })
// export class FileUploadComponent {
//   @Output() fileSelected = new EventEmitter<File>();
//   onFile(evt: any) {
//     const file = evt.target.files[0];
//     if (file) this.fileSelected.emit(file);
//   }
// }

// src/app/shared/components/file-upload/file-upload.component.ts
import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  template: `
    <div
      class="p-6 border-2 border-dashed rounded cursor-pointer hover:border-green-500"
      [class.border-green-500]="isDragging"
      (click)="fileInput.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        accept="image/*"
        class="hidden"
        (change)="onFile($event)"
      >
      <p class="text-center text-gray-500">
        {{ isDragging ? 'Drop image here' : 'Click or drag image here' }}
      </p>
    </div>
  `,
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  isDragging = false;

  onFile(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    if (file) this.fileSelected.emit(file);
  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    this.isDragging = false;
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.isDragging = false;
    if (!evt.dataTransfer) return;
    const file = evt.dataTransfer.files[0];
    if (file) this.fileSelected.emit(file);
  }
}
