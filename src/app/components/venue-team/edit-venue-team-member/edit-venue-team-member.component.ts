import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';
import { VenueHandlerService } from 'src/app/services/identity/venue-handler.service';

@Component({
  selector: 'app-edit-venue-team-member',
  templateUrl: './edit-venue-team-member.component.html',
  styleUrls: ['./edit-venue-team-member.component.less']
})
export class EditVenueTeamMemberComponent implements OnInit {

  public accountId: string = null;

  public editVenueAdminForm: FormGroup;
  public displayEmailExistsModal: boolean = false;

  public selectedVenueId: string = null;
  public selectedVenueName: string = "Loading...";

  constructor(
    private pendingSaveService: PendingSaveService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private venueHandler: VenueHandlerService
  ) {

   

    if(!this.venueHandler.venueExists) {
      this.venueHandler.venueLoaded.subscribe(() => {
        this.selectedVenueId = this.venueHandler.getChosenVenueId();
        this.selectedVenueName = this.venueHandler.getChosenVenueName();
      });
    } else {
      this.selectedVenueId = this.venueHandler.getChosenVenueId();
      this.selectedVenueName = this.venueHandler.getChosenVenueName();
    }

    this.venueHandler.venueChange.subscribe(() => {
      this.router.navigateByUrl('/venue-team');
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('accountId')) {
        console.log("did it come from here");
        this.accountId = paramMap.get('accountId');
        console.log(this.accountId);
        this.loadData();
      } else {
        // go back to team list
        this.router.navigateByUrl('/venue-team');
      }
    });

    this.editVenueAdminForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      lastName: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.minLength(3)
        ],
      }),
      jobDescription: new FormControl(''),
    });

    // validate the email once it has been entered.
    this.editVenueAdminForm.controls.email.valueChanges.subscribe(async (value) => {
      if(value === '') {
        this.displayEmailExistsModal = false;
      }

      if(this.editVenueAdminForm.controls.email.dirty && this.editVenueAdminForm.controls.email.valid) {
        const validateRequest = await this.validateAdminEmail();
        this.displayEmailExistsModal = !validateRequest.isValid;

      }
      else {
        this.displayEmailExistsModal = false;
      }
    });
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/accounts/venues/get-venue-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId,
        selectedVenueId: this.selectedVenueId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.editVenueAdminForm.patchValue({
          firstName: request.responseData.account.firstName,
          lastName: request.responseData.account.lastName,
          email: request.responseData.account.email,
          assignedVenue: request.responseData.account.assignedVenue,
          jobDescription: request.responseData.account.jobDescription,
        })

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not load account.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load account.',
        unsanitizedMessage: error
      });

    }
  }

  public async validateAdminEmail(): Promise<GenericValidatorResponse> {
    try {
      if(this.editVenueAdminForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.editVenueAdminForm.controls.email.value,
          accountId: this.accountId
        }).toPromise();

        if(validationQuery.status === 'ok' && !validationQuery.responseData['emailExists']) {
          return <GenericValidatorResponse> {
            isValid: true
          };
        }
        else {
          return <GenericValidatorResponse> {
            isValid: false
          };
        }

      }
      else {
        return <GenericValidatorResponse> {
          isValid: false
        };
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        unsanitizedMessage: error,
        displayMessage: 'Validation Error.'
      });
    }
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public async saveChanges(): Promise<void> {
    try {

      if (!this.editVenueAdminForm.valid || (this.editVenueAdminForm.value.password !== this.editVenueAdminForm.value.passwordConfirmation)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/venues/edit-venue-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId,
        firstName: this.editVenueAdminForm.value.firstName,
        lastName: this.editVenueAdminForm.value.lastName,
        email: this.editVenueAdminForm.value.email,
        jobDescription: this.editVenueAdminForm.value.jobDescription,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl('/venue-team', {
          state: {
            userEdited: true
          }
        })

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not edit the venue admin.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: error.error && error.error.message ? error.error.message : 'Could not edit the venue admin.',
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
