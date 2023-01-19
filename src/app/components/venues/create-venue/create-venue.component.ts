import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-venue',
  templateUrl: './create-venue.component.html',
  styleUrls: ['./create-venue.component.less']
})
export class CreateVenueComponent implements OnInit {

  public address: any = null;
  public city: any = null;

  public createVenueForm: FormGroup;

  public selectedImage: any = null;
  

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router
  ) {
    this.createVenueForm = new FormGroup({
      name: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),

      profileImage: new FormControl("", {
        validators: []
      }),    
    })

    this.createVenueForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.profileImage) {
        this.createVenueForm.setErrors({
          tooBig: true
        })
      } else {
        this.createVenueForm.setErrors(null)
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

        this.createVenueForm.setErrors({
          tooBig: true
        })

      } else {

        this.createVenueForm.setErrors(null);

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

  public async createVenue(): Promise<void> {
    try {

      if (!this.createVenueForm.valid || !this.address) {
        return;
      }

      console.log(this.createVenueForm.value);

      const request: any = await this.http.post(environment.api + '/api/admin/venues/create-venue', {
        token: this.authService.getAuthenticationState().authenticationToken,
        name: this.createVenueForm.value.name,
        profileImage: this.selectedImage,
        address: this.address,
        city: this.createVenueForm.value.city
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/venues/profile/${request.responseData.venueId}`, {
          state: {
            venueCreated: true
          }
        });
        
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
        displayMessage: "Could not load the venue.",
        unsanitizedMessage: error
      });

    }
  }

  public handleAddressChange(address: any): void {
    console.log(address);
    this.address = address;
  }

  ngOnInit(): void {
  }

}
