import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-influencer-admin',
  templateUrl: './edit-influencer-admin.component.html',
  styleUrls: ['./edit-influencer-admin.component.less']
})
export class EditInfluencerAdminComponent implements OnInit {

  public influencers: Influencer[] = [];

  public accountId: string = null;

  public editInfluencerAdminForm: FormGroup;
  public displayEmailExistsModal: boolean = false;

  private returnUrl: string = null;

  constructor(
    private pendingSaveService: PendingSaveService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {

    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {

      if(this.router.getCurrentNavigation().extras.state.returnUrl) {
        this.returnUrl = this.router.getCurrentNavigation().extras.state.returnUrl
      }
      
    }

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('accountId')) {

        this.accountId = paramMap.get('accountId');

        this.loadData();
        this.loadInfluencers();

      } else {
        // go back to team list
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/influencer-admins');
      }
    })

    this.editInfluencerAdminForm = new FormGroup({
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
      })
    });

    // validate the email once it has been entered.
    this.editInfluencerAdminForm.controls.email.valueChanges.subscribe(async (value) => {
      if(value === '') {
        this.displayEmailExistsModal = false;
      }

      if(this.editInfluencerAdminForm.controls.email.dirty && this.editInfluencerAdminForm.controls.email.valid) {
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
      const request: any = await this.http.post(environment.api + '/api/admin/accounts/influencers/get-influencer-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.editInfluencerAdminForm.patchValue({
          firstName: request.responseData.account.firstName,
          lastName: request.responseData.account.lastName,
          email: request.responseData.account.email,
          assignedInfluencer: request.responseData.account.assignedInfluencer,
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
      if(this.editInfluencerAdminForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.editInfluencerAdminForm.controls.email.value,
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

  public async saveChanges(): Promise<void> {
    try {

      if (!this.editInfluencerAdminForm.valid || (this.editInfluencerAdminForm.value.password !== this.editInfluencerAdminForm.value.passwordConfirmation)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/influencers/edit-influencer-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId,
        firstName: this.editInfluencerAdminForm.value.firstName,
        lastName: this.editInfluencerAdminForm.value.lastName,
        email: this.editInfluencerAdminForm.value.email,
        assignedInfluencer: this.editInfluencerAdminForm.value.assignedInfluencer
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/influencer-admins', {
          state: {
            userEdited: true
          }
        })

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not edit the influencer admin.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: error.error && error.error.message ? error.error.message : 'Could not edit the influencer admin.',
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
