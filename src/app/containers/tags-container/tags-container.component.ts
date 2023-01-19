import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tag } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { TagModalData, UpdateTagsModalComponent } from 'src/app/modals/update-tags-modal/update-tags-modal.component';

@Component({
  selector: 'app-tags-container',
  templateUrl: './tags-container.component.html',
  styleUrls: ['./tags-container.component.less']
})
export class TagsContainerComponent implements OnInit {

  @Input() tags: Tag[];
  @Input() availableTags: Tag[];

  @Output() updateTags = new EventEmitter<Tag[]>();
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onUpdate(){
    const dialogRef = this.dialog.open(UpdateTagsModalComponent, {
      data: {
        availableTags: this.availableTags,
        tagsSelected: this.tags,
      } as TagModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if(result){
        console.log('emit...', result);
        this.updateTags.emit(result);
      }
    });
  }

}
