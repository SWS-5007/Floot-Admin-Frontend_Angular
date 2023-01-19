import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.less']
})
export class ConfirmResetPasswordComponent implements OnInit {

  
  public confirmPasswordResetForm: FormGroup;
  public passwordResetHasCompleted: boolean = false;
  private passwordResetToken: string = "";

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    console.log('dkdlk')

    this.route.paramMap.subscribe(async(paramMap) => {

      if (paramMap.has('passwordResetToken')) {

        this.passwordResetToken = paramMap.get('passwordResetToken');

      } else {
        this.errorHandlerService.throwError({
          displayMessage: 'No password reset token has been provided.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    })

    this.confirmPasswordResetForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
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

    // validate the password once it has been entered.
    this.confirmPasswordResetForm.controls.password.valueChanges.subscribe(async (value) => {

      if (value !== this.confirmPasswordResetForm.value.confirmPassword || !this.authService.passwordValidator(value)) {
        this.confirmPasswordResetForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.confirmPasswordResetForm.controls.confirmPassword.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.confirmPasswordResetForm.controls.password.setErrors(null)
        this.confirmPasswordResetForm.controls.confirmPassword.setErrors(null)
      }

    });

    // validate the confirm password once it has been entered.
    this.confirmPasswordResetForm.controls.confirmPassword.valueChanges.subscribe(async (value) => {

      if (value !== this.confirmPasswordResetForm.value.password || !this.authService.passwordValidator(value)) {
        this.confirmPasswordResetForm.controls.password.setErrors({
          passwordsDontMatch: true
        })
        this.confirmPasswordResetForm.controls.confirmPassword.setErrors({
          passwordsDontMatch: true
        })
      } else {
        this.confirmPasswordResetForm.controls.password.setErrors(null)
        this.confirmPasswordResetForm.controls.confirmPassword.setErrors(null)
      }

    });
  }

  public async confirmResetPassword(): Promise<void> {
    try {

      if (!this.confirmPasswordResetForm.valid || (this.confirmPasswordResetForm.value.password !== this.confirmPasswordResetForm.value.confirmPassword) || !this.authService.passwordValidator(this.confirmPasswordResetForm.value.password)) {
        return
      }

      const request: any = await this.http.post(environment.api + '/api/admin/auth/confirm-reset-password', {
        token: this.authService.getAuthenticationState().authenticationToken,
        email: this.confirmPasswordResetForm.value.email,
        passwordResetToken: this.passwordResetToken,
        password: this.confirmPasswordResetForm.value.password
      }).toPromise();

      if(request.status === 'ok') {

        this.passwordResetHasCompleted = true;

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not reset your password.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not reset your password.',
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
