import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';

interface Venue {
  id: string,
  name: string,
  address: string
}

@Component({
  selector: 'app-edit-venue-admin',
  templateUrl: './edit-venue-admin.component.html',
  styleUrls: ['./edit-venue-admin.component.less']
})
export class EditVenueAdminComponent implements OnInit {

  public venues: Venue[] = [];
  assignedVenues: Venue[] = []
  public accountId: string = null;

  public editVenueAdminForm: FormGroup;
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

    this.route.paramMap.subscribe(async (paramMap) => {
      if (paramMap.has('accountId')) {

        this.accountId = paramMap.get('accountId');
        
        await this.init();

      } else {
        // go back to team list
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/venue-admins');
      }
    })

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
      assignedVenue: new FormControl('', Validators.required),
      jobDescription: new FormControl(''),
      decisionMaking: new FormControl(null)
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

    this.assignedVenue.valueChanges.subscribe(() => {
      this.onAssignedVenueChange();
    })
  }

  async init(){
    await this.loadVenues();
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/accounts/venues/get-venue-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        const account = request.responseData.account;
        this.editVenueAdminForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          assignedVenue: account.assignedVenue,
          jobDescription: account.jobDescription,
          decisionMaking: account.decisionMaking,
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

  onAssignedVenueChange() {
    const assignedIds = (this.assignedVenue.value ?? []) as string[];
    this.assignedVenues = this.venues.filter(venue => assignedIds.includes(venue.id));

    assignedIds.length == 0 ? this.decisionMaking.disable({emitEvent: false}) : this.decisionMaking.enable({emitEvent: false});

    const decisionMakingIds = (this.decisionMaking.getRawValue() ?? []) as string[];
    console.log('check',decisionMakingIds);
    const filteredVals = decisionMakingIds.filter(id => assignedIds.includes(id));
    this.decisionMaking.setValue(filteredVals);

    console.log('here...');
    this.onUserInputEvent();
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  private async loadVenues(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/get-venues', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.venues = request.responseData.venues.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);;

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
        displayMessage: "Could not load the venues.",
        unsanitizedMessage: error
      });

    }
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
        assignedVenue: this.editVenueAdminForm.value.assignedVenue,
        jobDescription: this.editVenueAdminForm.value.jobDescription,
        decisionMaking: this.decisionMaking.getRawValue() ?? [],
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/venue-admins', {
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

  get assignedVenue(): FormControl{
    return this.editVenueAdminForm.get('assignedVenue') as FormControl;
  }

  get decisionMaking(): FormControl{
    return this.editVenueAdminForm.get('decisionMaking') as FormControl;
  }

  ngOnInit(): void {
  }

}
