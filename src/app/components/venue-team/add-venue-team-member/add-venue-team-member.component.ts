import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { VenueHandlerService } from 'src/app/services/identity/venue-handler.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-venue-team-member',
  templateUrl: './add-venue-team-member.component.html',
  styleUrls: ['./add-venue-team-member.component.less']
})
export class AddVenueTeamMemberComponent implements OnInit {

  public addVenueAdminForm: FormGroup;
  public displayEmailExistsModal: boolean = false;

  public autoAssignVenue: string = null;
  public chosenVenueName: string = null;

  constructor(
    private pendingSaveService: PendingSaveService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private venueHandler: VenueHandlerService
  ) {

    this.addVenueAdminForm = new FormGroup({
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
      password: new FormControl('', {
        validators: [
          Validators.required,
        ]
      }),
      passwordConfirmation: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
    });

    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      console.log(this.router.getCurrentNavigation().extras.state)

      if(this.router.getCurrentNavigation().extras.state.venueId) {
        this.addVenueAdminForm.patchValue({
          assignedVenue: this.router.getCurrentNavigation().extras.state.venueId
        })
        this.autoAssignVenue = this.router.getCurrentNavigation().extras.state.venueId
      }
      
    }

    // validate the email once it has been entered.
    this.addVenueAdminForm.controls.email.valueChanges.subscribe(async (value) => {
      if(value === '') {
        this.displayEmailExistsModal = false;
      }

      if(this.addVenueAdminForm.controls.email.dirty && this.addVenueAdminForm.controls.email.valid) {
        const validateRequest = await this.validateNewAdminEmail();
        this.displayEmailExistsModal = !validateRequest.isValid;

      }
      else {
        this.displayEmailExistsModal = false;
      }
    });

    // validate the password once it has been entered.
    this.addVenueAdminForm.controls.password.valueChanges.subscribe(async (value) => {

      if (value !== this.addVenueAdminForm.value.passwordConfirmation || !this.authService.passwordValidator(value)) {
        this.addVenueAdminForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.addVenueAdminForm.controls.passwordConfirmation.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.addVenueAdminForm.controls.password.setErrors(null)
        this.addVenueAdminForm.controls.passwordConfirmation.setErrors(null)
      }

    });

    // validate the confirm password once it has been entered.
    this.addVenueAdminForm.controls.passwordConfirmation.valueChanges.subscribe(async (value) => {

      if (value !== this.addVenueAdminForm.value.password || !this.authService.passwordValidator(value)) {
        this.addVenueAdminForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.addVenueAdminForm.controls.passwordConfirmation.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.addVenueAdminForm.controls.password.setErrors(null)
        this.addVenueAdminForm.controls.passwordConfirmation.setErrors(null)
      }

    });
    if(!this.venueHandler.venueExists) {
      this.venueHandler.venueLoaded.subscribe(() => {
        this.chosenVenueName = this.venueHandler.getChosenVenueName();
      });
    } else {
      this.chosenVenueName = this.venueHandler.getChosenVenueName();
    }

    this.venueHandler.venueChange.subscribe(() => {
      this.chosenVenueName = this.venueHandler.getChosenVenueName();
    });
  }

  public async validateNewAdminEmail(): Promise<GenericValidatorResponse> {
    try {
      if(this.addVenueAdminForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.addVenueAdminForm.controls.email.value
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

  public async addAdminAccount(): Promise<void> {
    try {

      if (!this.addVenueAdminForm.valid || (this.addVenueAdminForm.value.password !== this.addVenueAdminForm.value.passwordConfirmation) || !this.authService.passwordValidator(this.addVenueAdminForm.value.password)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/venues/add-venue-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        firstName: this.addVenueAdminForm.value.firstName,
        lastName: this.addVenueAdminForm.value.lastName,
        email: this.addVenueAdminForm.value.email,
        password: this.addVenueAdminForm.value.password,
        assignedVenue: this.venueHandler.getChosenVenueId()
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl('/venue-team', {
          state: {
            userCreated: true
          }
        })

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not add the admin account.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: error.error && error.error.message ? error.error.message : 'Could not add the admin account.',
        unsanitizedMessage: error
      });

    }
  }

  public validatePassword(password: string): boolean {
    return this.authService.passwordValidator(password)
  }

  ngOnInit(): void {
  }

}
