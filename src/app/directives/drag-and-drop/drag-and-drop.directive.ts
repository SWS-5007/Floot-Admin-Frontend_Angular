import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';
import { FileData } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Directive({
  selector: '[appDragDrop]'
})
export class DragAndDropDirective {

  @HostBinding('class.fileover') fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    console.log('Files dropped...', evt);
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}
