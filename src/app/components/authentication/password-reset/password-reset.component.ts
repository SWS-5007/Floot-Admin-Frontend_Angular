import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less']
})
export class PasswordResetComponent implements OnInit {

  public passwordResetFormGroup: FormGroup;
  public passwordResetHasCompleted: boolean = false;

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService
  ) { }

  /**
   *
   *
   * @memberof PasswordResetComponent
   */
  public ngOnInit(): void {
    this.passwordResetFormGroup = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof PasswordResetComponent
   */
  public async passwordResetFormSubmit(): Promise<void> {
    try {
      if(this.passwordResetFormGroup.valid) {
        const request: any = await this.http.post(environment.api + '/api/admin/auth/reset-password', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.passwordResetFormGroup.controls.email.value
        }).toPromise();

        if(request.status === 'ok') {
          this.passwordResetHasCompleted = true;

        }
        else {
          throw request.message;
        }
      }

    }
    catch(error) {

      this.errorHandlerService.throwError({
        displayMessage: error.error && error.error.message ? error.error.message : "Invalid request",
        unsanitizedMessage: error
      });
    }
  }



}
