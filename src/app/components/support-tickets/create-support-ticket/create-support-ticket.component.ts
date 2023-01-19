import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import Roles from 'src/app/types/roles';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-support-ticket',
  templateUrl: './create-support-ticket.component.html',
  styleUrls: ['./create-support-ticket.component.less']
})
export class CreateSupportTicketComponent implements OnInit {

  public createTicketForm: FormGroup;

  public selectedImage: any = null;
  public ticketSubmitted: boolean = false;

  public isFlootAdmin: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
  ) {
    this.createTicketForm = new FormGroup({
      title: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      description: new FormControl("", {
        validators: [
          Validators.required
        ]
      }),
      attachment: new FormControl("", {
        validators: []
      }), 
    })

    if (this.authService.account.role === Roles.FlootAdmin) {

      this.isFlootAdmin = true;
    }

    this.createTicketForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.attachment) {
        this.createTicketForm.setErrors({
          tooBig: true
        })
      } else {
        this.createTicketForm.setErrors(null)
      }
    })
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onImageSelected(event: any): void {

    var reader = new FileReader();

    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.createTicketForm.setErrors({
          tooBig: true
        })

      } else {

        this.createTicketForm.setErrors(null);

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedImage = {
            buffer: readerLoadEvent.target.result,
            meta: {
              fileName: event.target.files[0].name,
              fileType: event.target.files[0].type
            }
          }
          this.onUserInputEvent();
        }
      }
    }
  }

  public async createTicket(): Promise<void> {
    try {

      if (!this.createTicketForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/support-tickets/create-ticket', {
        token: this.authService.getAuthenticationState().authenticationToken,
        title: this.createTicketForm.value.title,
        description: this.createTicketForm.value.description,
        attachment: this.selectedImage,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
      
        this.ticketSubmitted = true;
        this.selectedImage = null;
        this.createTicketForm.setValue({
          title: null,
          description: null,
          attachment: null,
        })
        
      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not submit the ticket.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
