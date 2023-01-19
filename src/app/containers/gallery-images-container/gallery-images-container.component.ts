import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileData, GalleryImage } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { DragAndDropDirective } from 'src/app/directives/drag-and-drop/drag-and-drop.directive';
import transformFile from 'src/app/global/fileReader';
import { AddImageModalComponent, ImageFormData } from 'src/app/modals/add-image-modal/add-image-modal.component';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-gallery-images-container',
  templateUrl: './gallery-images-container.component.html',
  styleUrls: ['./gallery-images-container.component.less']
})
export class GalleryImagesContainerComponent implements OnInit {

  @Input() galleryImages: GalleryImage[];
  @Output() addImage = new EventEmitter<ImageFormData>();
  @Output() deleteImage = new EventEmitter<string>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  async onFileDrop(files: FileList){
    let fileObj = null;
    if(!(files && files.length == 1)){
      return;
    }
    const file = files.item(0);
    fileObj = await transformFile(file);
    this.onAddImage(fileObj);
  }

  onAddImage(fileObj?: FileData){
    const dialogRef = this.dialog.open(AddImageModalComponent, {
      data: fileObj
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('before emit', result);
        this.addImage.emit(result);
      }
    })
  }

  onDeleteImage(imageId: string){
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        heading: "Delete Gallery image",
        message: "Are you sure you would like to delete this image?",
        data: imageId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteImage.emit(imageId);
      }
    })
  }
}
