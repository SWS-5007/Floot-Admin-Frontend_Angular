import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExternalLink } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { DeleteModalComponent, DeleteModalData } from 'src/app/modals/delete-modal/delete-modal.component';
import { UpdateExternalLinkModalComponent } from 'src/app/modals/update-external-link-modal/update-external-link-modal.component';

@Component({
  selector: 'app-external-link-container',
  templateUrl: './external-link-container.component.html',
  styleUrls: ['./external-link-container.component.less']
})
export class ExternalLinkContainerComponent implements OnInit {

  @Input() externalLink: ExternalLink;

  @Output() updateLink = new EventEmitter<ExternalLink>();
  @Output() removeLink = new EventEmitter<void>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onUpdateLink(){
    const dialogRef=this.dialog.open(UpdateExternalLinkModalComponent, {
      data: this.externalLink
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('before emit', result);
        this.updateLink.emit(result)
      }
    })
  }

  onRemoveLink(){
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        heading: "Remove External Link",
        message: "Are you sure you would like to remove the external link?"
      }
    });

    dialogRef.afterClosed().subscribe((result: DeleteModalData) => {
      if(result != null){
        this.removeLink.emit();
      }
    })
  }

}
