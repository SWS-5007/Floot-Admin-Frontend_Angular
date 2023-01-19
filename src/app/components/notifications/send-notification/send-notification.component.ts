import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.less']
})
export class SendNotificationComponent implements OnInit {
  
  public sendNotificationForm: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router
  ) {
    this.sendNotificationForm = new FormGroup({
      title: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      subtitle: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),    
    })
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public async sendNotification(): Promise<void> {
    try {

      if (!this.sendNotificationForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/notifications/push-notification', {
        token: this.authService.getAuthenticationState().authenticationToken,
        title: this.sendNotificationForm.value.title,
        subtitle: this.sendNotificationForm.value.subtitle
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.pendingSaveService.setPendingChangeState(false);
        
        this.router.navigateByUrl(`/notifications`, {
          state: {
            notificationSent: true
          }
        });
        
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
        displayMessage: "Could not send the notification.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
