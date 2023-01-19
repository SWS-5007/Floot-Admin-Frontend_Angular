import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';

interface Influencer {
  id: string,
  name: string,
  address: string
}

@Component({
  selector: 'app-add-influencer-admin',
  templateUrl: './add-influencer-admin.component.html',
  styleUrls: ['./add-influencer-admin.component.less']
})
export class AddInfluencerAdminComponent implements OnInit {

  public influencers: Influencer[] = [];

  public addInfluencerAdminForm: FormGroup;
  public displayEmailExistsModal: boolean = false;

  public autoAssignInfluencer: string = null;

  constructor(
    private pendingSaveService: PendingSaveService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {

    this.loadInfluencers();

    this.addInfluencerAdminForm = new FormGroup({
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
      assignedInfluencer: new FormControl('', {
        validators: [
          Validators.required
        ]
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

      if(this.router.getCurrentNavigation().extras.state.influencerId) {
        this.addInfluencerAdminForm.patchValue({
          assignedInfluencer: this.router.getCurrentNavigation().extras.state.influencerId
        })
        this.autoAssignInfluencer = this.router.getCurrentNavigation().extras.state.influencerId
      }
      
    }

    // validate the email once it has been entered.
    this.addInfluencerAdminForm.controls.email.valueChanges.subscribe(async (value) => {
      if(value === '') {
        this.displayEmailExistsModal = false;
      }

      if(this.addInfluencerAdminForm.controls.email.dirty && this.addInfluencerAdminForm.controls.email.valid) {
        const validateRequest = await this.validateNewAdminEmail();
        this.displayEmailExistsModal = !validateRequest.isValid;

      }
      else {
        this.displayEmailExistsModal = false;
      }
    });

    // validate the password once it has been entered.
    this.addInfluencerAdminForm.controls.password.valueChanges.subscribe(async (value) => {

      if (value !== this.addInfluencerAdminForm.value.passwordConfirmation || !this.authService.passwordValidator(value)) {
        this.addInfluencerAdminForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.addInfluencerAdminForm.controls.passwordConfirmation.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.addInfluencerAdminForm.controls.password.setErrors(null)
        this.addInfluencerAdminForm.controls.passwordConfirmation.setErrors(null)
      }

    });

    // validate the confirm password once it has been entered.
    this.addInfluencerAdminForm.controls.passwordConfirmation.valueChanges.subscribe(async (value) => {

      if (value !== this.addInfluencerAdminForm.value.password || !this.authService.passwordValidator(value)) {
        this.addInfluencerAdminForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.addInfluencerAdminForm.controls.passwordConfirmation.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.addInfluencerAdminForm.controls.password.setErrors(null)
        this.addInfluencerAdminForm.controls.passwordConfirmation.setErrors(null)
      }

    });
  }

  public async validateNewAdminEmail(): Promise<GenericValidatorResponse> {
    try {
      if(this.addInfluencerAdminForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.addInfluencerAdminForm.controls.email.value
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

  private async loadInfluencers(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/influencers/get-influencers', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.influencers = request.responseData.influencers.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);;

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
        displayMessage: "Could not load the influencers.",
        unsanitizedMessage: error
      });

    }
  }

  public async addAdminAccount(): Promise<void> {
    try {

      if (!this.addInfluencerAdminForm.valid || (this.addInfluencerAdminForm.value.password !== this.addInfluencerAdminForm.value.passwordConfirmation) || !this.authService.passwordValidator(this.addInfluencerAdminForm.value.password)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/influencers/add-influencer-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        firstName: this.addInfluencerAdminForm.value.firstName,
        lastName: this.addInfluencerAdminForm.value.lastName,
        email: this.addInfluencerAdminForm.value.email,
        password: this.addInfluencerAdminForm.value.password,
        assignedInfluencer: this.addInfluencerAdminForm.value.assignedInfluencer,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.autoAssignInfluencer ? `/influencers/profile/${this.autoAssignInfluencer}` : '/influencer-admins', {
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
