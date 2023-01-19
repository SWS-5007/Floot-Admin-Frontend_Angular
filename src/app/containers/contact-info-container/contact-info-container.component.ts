
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactInfoFormData, UpdateContactInfoModalComponent } from 'src/app/modals/update-contact-info-modal/update-contact-info-modal.component';

@Component({
  selector: 'app-contact-info-container',
  templateUrl: './contact-info-container.component.html',
  styleUrls: ['./contact-info-container.component.less']
})
export class ContactInfoContainerComponent implements OnInit {

  @Input() phoneNumber: string;
  @Input() email: string;

  @Output() updateContact = new EventEmitter<ContactInfoFormData>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onContactUpdate(){
    const dialogRef = this.dialog.open(UpdateContactInfoModalComponent, {
      data: {
        email: this.email,
        phone: this.phoneNumber,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('before emit', result);
        this.updateContact.emit(result);
      }
    })
  }

}
