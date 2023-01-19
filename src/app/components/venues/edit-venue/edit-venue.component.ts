import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';
import { VenueHandlerService } from 'src/app/services/identity/venue-handler.service';

@Component({
  selector: 'app-edit-venue',
  templateUrl: './edit-venue.component.html',
  styleUrls: ['./edit-venue.component.less']
})
export class EditVenueComponent implements OnInit {
  
  public venueId: string = null;

  public address: any = null;

  public editVenueForm: FormGroup;

  public selectedImage: any = null;

  public venueName: string = null;
  public existingProfileImageUrl: string = null;
  

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private route: ActivatedRoute,
    private venueHandler: VenueHandlerService
  ) {

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('venueId')) {
        console.log("got venue id from here")
        this.venueId = paramMap.get('venueId');

        this.loadData();

      } else {
        this.router.navigateByUrl('/venues');
      }
    })

    this.venueHandler.venueChange.subscribe(() => {
      this.venueId = this.venueHandler.getChosenVenueId();
      this.loadData();
    });

    this.editVenueForm = new FormGroup({
      name: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      profileImage: new FormControl("", {
        validators: []
      }),
      description: new FormControl('',  Validators.maxLength(500))
    })

    this.editVenueForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.profileImage) {
        this.editVenueForm.setErrors({
          tooBig: true
        })
      } else {
        this.editVenueForm.setErrors(null)
      }
    })


  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/get-venue-basic-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.venueName = request.responseData.venue.name;
        this.existingProfileImageUrl = request.responseData.venue.profileImageUrl;
       
        this.editVenueForm.patchValue({
          name: request.responseData.venue.name,
        })

        this.address = request.responseData.venue.address;
        
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

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onImageSelected(event: any): void {

    var reader = new FileReader();

    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.editVenueForm.setErrors({
          tooBig: true
        })

      } else {

        this.editVenueForm.setErrors(null);

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

  public removeProfileImage(): void {
    this.existingProfileImageUrl = null;
  }

  public async editVenue(): Promise<void> {
    try {

      if (!this.editVenueForm.valid) {
        return;
      }

      const {name, description} = this.editVenueForm.value;

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/edit-venue', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        name,
        description,
        profileImage: this.selectedImage,
        address: this.address,
        existingImage: this.existingProfileImageUrl
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        await this.venueHandler.getVenueDetails();
        this.venueHandler.setChosenVenue(this.venueId);
        this.venueHandler.venueEdited.emit();

        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/venues/profile/${this.venueId}`, {
          state: {
            venueEdited: true
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
        displayMessage: "Could not edit the venue.",
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
