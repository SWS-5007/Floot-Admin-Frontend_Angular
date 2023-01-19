import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import GenericValidatorResponse from 'src/app/types/generic-validator-response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.less']
})
export class AddTeamMemberComponent implements OnInit {

  public addTeamMemberForm: FormGroup;
  public displayEmailExistsModal: boolean = false;

  constructor(
    private pendingSaveService: PendingSaveService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    try {

      this.addTeamMemberForm = new FormGroup({
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

      // validate the email once it has been entered.
      this.addTeamMemberForm.controls.email.valueChanges.subscribe(async (value) => {
        if(value === '') {
          this.displayEmailExistsModal = false;
        }

        if(this.addTeamMemberForm.controls.email.dirty && this.addTeamMemberForm.controls.email.valid) {
          const validateRequest = await this.validateNewAdminEmail();
          this.displayEmailExistsModal = !validateRequest.isValid;

        }
        else {
          this.displayEmailExistsModal = false;
        }
      });

      // validate the password once it has been entered.
      this.addTeamMemberForm.controls.password.valueChanges.subscribe(async (value) => {

        if (value !== this.addTeamMemberForm.value.passwordConfirmation || !this.authService.passwordValidator(value)) {
          this.addTeamMemberForm.controls.password.setErrors({
            passwordsDontMatch: true
          })
          this.addTeamMemberForm.controls.passwordConfirmation.setErrors({
            passwordsDontMatch: true
          })
        } else {
          this.addTeamMemberForm.controls.password.setErrors(null)
          this.addTeamMemberForm.controls.passwordConfirmation.setErrors(null)
        }

      });

      // validate the confirm password once it has been entered.
      this.addTeamMemberForm.controls.passwordConfirmation.valueChanges.subscribe(async (value) => {

        if (value !== this.addTeamMemberForm.value.password || !this.authService.passwordValidator(value)) {
          this.addTeamMemberForm.controls.password.setErrors({
            passwordsDontMatch: true
          })
          this.addTeamMemberForm.controls.passwordConfirmation.setErrors({
            passwordsDontMatch: true
          })
        } else {
          this.addTeamMemberForm.controls.password.setErrors(null)
          this.addTeamMemberForm.controls.passwordConfirmation.setErrors(null)
        }

      });

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Unknown error',
        unsanitizedMessage: error
      });
    }
  }

  public async validateNewAdminEmail(): Promise<GenericValidatorResponse> {
    try {
      if(this.addTeamMemberForm.controls.email.dirty) {
        const validationQuery: any = await this.http.post(environment.api + '/api/admin/accounts/validate-email', {
          token: this.authService.getAuthenticationState().authenticationToken,
          email: this.addTeamMemberForm.controls.email.value
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

  public async addTeamMember(): Promise<void> {
    try {

      if (!this.addTeamMemberForm.valid || (this.addTeamMemberForm.value.password !== this.addTeamMemberForm.value.passwordConfirmation) || !this.authService.passwordValidator(this.addTeamMemberForm.value.password)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/floot/add-team-member', {
        token: this.authService.getAuthenticationState().authenticationToken,
        firstName: this.addTeamMemberForm.value.firstName,
        lastName: this.addTeamMemberForm.value.lastName,
        email: this.addTeamMemberForm.value.email,
        password: this.addTeamMemberForm.value.password,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl('/floot-team', {
          state: {
            userCreated: true
          }
        })

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not add the team member.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: error.error && error.error.message ? error.error.message : 'Could not add the team member.',
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
