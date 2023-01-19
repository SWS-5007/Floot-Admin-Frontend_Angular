import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileData, Menu } from 'src/app/components/venues/venue-profile/venue-profile.component';
import transformFile from 'src/app/global/fileReader';
import { AddMenuForm, AddMenuModalComponent } from 'src/app/modals/add-menu-modal/add-menu-modal.component';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-menu-container',
  templateUrl: './menu-container.component.html',
  styleUrls: ['./menu-container.component.less']
})
export class MenuContainerComponent implements OnInit {

  readonly colors = ['#F6E6CD', '#CDE1E7', '#CBBBD8', '#B1D9BF']
  @Input() menuList: Menu[];

  @Output() addMenu = new EventEmitter<AddMenuForm>();
  @Output() deleteMenu = new EventEmitter<string>();
  @Output() viewMenu = new EventEmitter<string>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  async onFileDrop(files: FileList){
    let fileObj = null;
    if(!(files && files.length == 1)){
      return;
    }
    console.log(files);
    const file = files.item(0);
    fileObj = await transformFile(file);
    this.onAddMenu(fileObj);
  }

  onDeleteMenu(menuId: string){
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        heading: "Delete Menu",
        message: "Are you sure you would like to delete this menu?",
        data: menuId
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        console.log('before emit...', result)
        this.deleteMenu.emit(menuId);
      }
    })
  }

  onAddMenu(fileObj?: FileData){
    const dialogRef = this.dialog.open(AddMenuModalComponent, {
      data: fileObj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('before emit..', result);
        this.addMenu.emit(result);
      }
    })
  }

}
