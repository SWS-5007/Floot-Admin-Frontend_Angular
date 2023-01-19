import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-supplier-team-member',
  templateUrl: './add-supplier-team-member.component.html',
  styleUrls: ['./add-supplier-team-member.component.less']
})
export class AddSupplierTeamMemberComponent implements OnInit {

  public addSupplierAdminForm: FormGroup;
  public displayEmailExistsModal: boolean = false;

  public autoAssignSupplier: string = null;

  constructor(
    private pendingSaveService: PendingSaveService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {

    this.addSupplierAdminForm = new FormGroup({
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
      

      if(this.router.getCurrentNavigation().extras.state.supplierId) {
        this.addSupplierAdminForm.patchValue({
          assignSupplier: this.router.getCurrentNavigation().extras.state.supplierId
        })
        this.autoAssignSupplier = this.router.getCurrentNavigation().extras.state.supplierId
      }
      
    }

    // validate the email once it has been entered.
    this.addSupplierAdminForm.controls.email.valueChanges.subscribe(async (value) => {
      if(value === '') {
        this.displayEmailExistsModal = false;
      }

      if(this.addSupplierAdminForm.controls.email.dirty && this.addSupplierAdminForm.controls.email.valid) {
        const validateRequest = await this.validateNewAdminEmail();
        this.displayEmailExistsModal = !validateRequest.isValid;

      }
      else {
        this.displayEmailExistsModal = false;
      }
    });

    // validate the password once it has been entered.
    this.addSupplierAdminForm.controls.password.valueChanges.subscribe(async (value) => {

      if (value !== this.addSupplierAdminForm.value.passwordConfirmation || !this.authService.passwordValidator(value)) {
        this.addSupplierAdminForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.addSupplierAdminForm.controls.passwordConfirmation.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.addSupplierAdminForm.controls.password.setErrors(null)
        this.addSupplierAdminForm.controls.passwordConfirmation.setErrors(null)
      }

    });

    // validate the confirm password once it has been entered.
    this.addSupplierAdminForm.controls.passwordConfirmation.valueChanges.subscribe(async (value) => {

      if (value !== this.addSupplierAdminForm.value.password || !this.authService.passwordValidator(value)) {
        this.addSupplierAdminForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.addSupplierAdminForm.controls.passwordConfirmation.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.addSupplierAdminForm.controls.password.setErrors(null)
        this.addSupplierAdminForm.controls.passwordConfirmation.setErrors(null)
      }

    });
  }

  public async validateNewAdminEmail(): Promise<GenericValidatorResponse> {
    try {
      if(this.addSupplierAdminForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.addSupplierAdminForm.controls.email.value
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

      if (!this.addSupplierAdminForm.valid || (this.addSupplierAdminForm.value.password !== this.addSupplierAdminForm.value.passwordConfirmation) || !this.authService.passwordValidator(this.addSupplierAdminForm.value.password)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/suppliers/add-supplier-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        firstName: this.addSupplierAdminForm.value.firstName,
        lastName: this.addSupplierAdminForm.value.lastName,
        email: this.addSupplierAdminForm.value.email,
        password: this.addSupplierAdminForm.value.password,
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl('/supplier-team', {
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
