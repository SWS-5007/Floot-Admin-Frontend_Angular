import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-policy',
  templateUrl: './edit-policy.component.html',
  styleUrls: ['./edit-policy.component.less']
})
export class EditPolicyComponent implements OnInit {

  public policyId: string = null;
  public title: string = null;

  public policyForm: FormGroup = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private pendingSaveService: PendingSaveService
  ) {

    this.policyForm = new FormGroup({
      content: new FormControl("", {
        validators: [
          Validators.required
        ]
      })
    })

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('policyId')) {

        this.policyId = paramMap.get('policyId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('/policies');
      }
    });
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/policies/get-policy', {
        token: this.authService.getAuthenticationState().authenticationToken,
        policyId: this.policyId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.title = request.responseData.title;
        
        this.policyForm.patchValue({
          content: request.responseData.content
        })

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
        displayMessage: "Could not load the policy.",
        unsanitizedMessage: error
      });

    }
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public async saveChanges(): Promise<void> {
    try {

      if (!this.policyForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/policies/edit-policy', {
        token: this.authService.getAuthenticationState().authenticationToken,
        policyId: this.policyId,
        content: this.policyForm.value.content
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.pendingSaveService.setPendingChangeState(false)

        this.router.navigateByUrl(`/policies/${this.policyId}`, {
          state: {
            policyEdited: false
          }
        })

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
        displayMessage: "Could not load the policy.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
