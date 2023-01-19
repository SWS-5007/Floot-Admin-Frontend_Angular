import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.less']
})
export class ViewAccountComponent implements OnInit {

  public updatePasswordFormGroup: FormGroup;
  public userFormGroup: FormGroup;
  public account: any;

  public accountIsUpdated: boolean = false;
  public passwordWasUpdated: boolean = false;
  public passwordMustMatchError: boolean = false;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private pendingSaveService: PendingSaveService
  ) {
  }

  /**
   *
   *
   * @memberof ViewAccountComponent
   */
  public ngOnInit(): void {
    try {
      this.userFormGroup = new FormGroup({
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
        email: new FormControl(''),
      });

      this.updatePasswordFormGroup = new FormGroup({
        password: new FormControl('', {
          validators: [
            Validators.required
          ]
        }),
        confirmPassword: new FormControl('', {
          validators: [
            Validators.required
          ]
        })
      });

      // look for changes on the password input to ensure they match.
      this.updatePasswordFormGroup.valueChanges.subscribe(() => {
        if(this.updatePasswordFormGroup.valid) {
          if(this.updatePasswordFormGroup.controls.password.value === this.updatePasswordFormGroup.controls.confirmPassword.value && this.authService.passwordValidator(this.updatePasswordFormGroup.value.password)) {
            this.passwordMustMatchError = false;
            this.updatePasswordFormGroup.setErrors(null);

          }
          else {
            this.passwordMustMatchError = true;
            this.updatePasswordFormGroup.setErrors({
              passwordDoesNotMatchError: true
            });

          }
        }
      });

      this.loadAccountData();

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not render form',
        unsanitizedMessage: error
      });
    }
  }

  /**
   *
   *
   * @param {*} date
   * @return {*}  {string}
   * @memberof ViewAccountComponent
   */
  public formatDate(date: any): string {
    try {
      return new Date(date).toString();
    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not formate date',
        unsanitizedMessage: error
      });
    }
  }

  /**
   *
   *
   * @memberof ViewAccountComponent
   */
  public signOut(): void {
    this.authService.signOut();
  }

  /**
   *
   *
   * @memberof ViewAccountComponent
   */
  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof ViewAccountComponent
   */
  public async saveChanges(): Promise<void> {
    try {
      if(!this.userFormGroup.controls.firstName.errors && !this.userFormGroup.controls.lastName.errors) {
        
        const request: any = await this.http.post(environment.api + '/api/admin/auth/identity/update-current-user', {
          token: this.authService.getAuthenticationState().authenticationToken,
          firstName: this.userFormGroup.value.firstName,
          lastName: this.userFormGroup.value.lastName
        }).toPromise();

        if(request.status === 'ok') {
          // update the account stored in the auth service.
          await this.authService.loadAccount();
          this.accountIsUpdated = true;

          // reset pending save service state
          this.pendingSaveService.setPendingChangeState(false);
        }
        else {
          throw request.message;
        }
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not save changes.',
        unsanitizedMessage: error
      });
    }
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof ViewAccountComponent
   */
  public async updatePasswordFormSubmit(): Promise<void> {
    try {

      if (!this.authService.passwordValidator(this.updatePasswordFormGroup.value.password)) {
        return;
      }
      const request: any = await this.http.post(environment.api + '/api/admin/auth/identity/update-current-user-password', {
        token: this.authService.getAuthenticationState().authenticationToken,
        password: this.updatePasswordFormGroup.controls.password.value

      }).toPromise();

      if(request.status === 'ok') {
        this.passwordWasUpdated = true;

      }
      else {
        throw request.message;
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not update password.',
        unsanitizedMessage: error
      });
    }
  }

  /**
   *
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof ViewAccountComponent
   */
  private async loadAccountData(): Promise<void> {
    try {
      if(!this.authService.account) {
        await this.authService.loadAccount();
      }

      this.account = this.authService.account;

      this.userFormGroup.controls.firstName.setValue(this.authService.account.name.split(' ')[0]);
      this.userFormGroup.controls.lastName.setValue(this.authService.account.name.split(' ')[1]);
      this.userFormGroup.controls.email.setValue(this.authService.account.email);

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load account',
        unsanitizedMessage: error
      });
    }
  }

  public validatePassword(password: string): boolean {
    return this.authService.passwordValidator(password)
  }

}
