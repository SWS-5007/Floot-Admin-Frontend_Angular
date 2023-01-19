import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';

interface Supplier {
  id: string,
  name: string
}

@Component({
  selector: 'app-edit-supplier-admin',
  templateUrl: './edit-supplier-admin.component.html',
  styleUrls: ['./edit-supplier-admin.component.less']
})
export class EditSupplierAdminComponent implements OnInit {

  public suppliers: Supplier[] = [];

  public accountId: string = null;

  public editSupplierAdminForm: FormGroup;
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

        this.loadSuppliers();
        this.loadData();

      } else {
        // go back to team list
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/supplier-admins');
      }
    })

    this.editSupplierAdminForm = new FormGroup({
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
      assignedSupplier: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });

    // validate the email once it has been entered.
    /*this.editSupplierAdminForm.controls.email.valueChanges.subscribe(async (value) => {
      if(value === '') {
        this.displayEmailExistsModal = false;
      }

      if(this.editSupplierAdminForm.controls.email.dirty && this.editSupplierAdminForm.controls.email.valid) {
        const validateRequest = await this.validateAdminEmail();
        this.displayEmailExistsModal = !validateRequest.isValid;

      }
      else {
        this.displayEmailExistsModal = false;
      }
    });*/
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/accounts/suppliers/get-supplier-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.editSupplierAdminForm.patchValue({
          firstName: request.responseData.account.firstName,
          lastName: request.responseData.account.lastName,
          email: request.responseData.account.email,
          assignedSupplier: request.responseData.account.assignedSupplier,
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
      if(this.editSupplierAdminForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.editSupplierAdminForm.controls.email.value,
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

  private async loadSuppliers(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/get-suppliers', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.suppliers = request.responseData.suppliers.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);;

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
        displayMessage: "Could not load the suppliers.",
        unsanitizedMessage: error
      });

    }
  }

  public async saveChanges(): Promise<void> {
    try {

      if (!this.editSupplierAdminForm.valid || (this.editSupplierAdminForm.value.password !== this.editSupplierAdminForm.value.passwordConfirmation)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/suppliers/edit-supplier-admin', {
        token: this.authService.getAuthenticationState().authenticationToken,
        accountId: this.accountId,
        firstName: this.editSupplierAdminForm.value.firstName,
        lastName: this.editSupplierAdminForm.value.lastName,
        email: this.editSupplierAdminForm.value.email,
        assignedSupplier: this.editSupplierAdminForm.value.assignedSupplier
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/supplier-admins', {
          state: {
            userEdited: true
          }
        })

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not edit the supplier admin.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: error.error && error.error.message ? error.error.message : 'Could not edit the supplier admin.',
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
