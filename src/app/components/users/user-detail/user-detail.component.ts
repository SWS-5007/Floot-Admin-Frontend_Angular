import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface UserInfo {
  name: string,
  dateOfBirth: Date,
  email: string,
  profileImageUrl: string,
}

interface ContactPreferences {
  pushNotifications: boolean,
  emailNotifications: boolean,
  marketingEmails: boolean
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.less']
})
export class UserDetailComponent implements OnInit {

  public userId: string = null;

  public userInfo: UserInfo = null;
  public contactPreferences: ContactPreferences = null;
  public banned: boolean = false;
  public mixpanelUrl: string = null;

  public userEdited: boolean = false;
  public userBanned: boolean = false;
  public userUnbanned: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('userId')) {

        this.userId = paramMap.get('userId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('/users');
      }
    });

    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.userEdited) {
        this.userEdited = true

        setTimeout(() => {
          this.userEdited = false;
        }, 3000);
      }
      
    }
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/users/get-user-profile', {
        token: this.authService.getAuthenticationState().authenticationToken,
        userId: this.userId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.userInfo = request.responseData.user.userInfo;
        this.contactPreferences = request.responseData.user.contactPreferences
        
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
        displayMessage: "Could not load the user.",
        unsanitizedMessage: error
      });

    }
  }

  public async banUser(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/users/account/ban-user', {
        token: this.authService.getAuthenticationState().authenticationToken,
        userId: this.userId,
      }).toPromise();

      if(request.status === 'ok' && request.responseData.userBanned === true) {
        this.banned = true;
        this.userBanned = true;
        setTimeout(() => {
          this.userBanned = false;
        }, 3000)
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
        displayMessage: "Could not ban the user.",
        unsanitizedMessage: error
      });

    }
  }

  public async unbanUser(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/users/account/unban-user', {
        token: this.authService.getAuthenticationState().authenticationToken,
        userId: this.userId,
      }).toPromise();

      if(request.status === 'ok' && request.responseData.userUnbanned === true) {
        this.banned = false;
        this.userUnbanned = true;
        setTimeout(() => {
          this.userUnbanned = false;
        }, 3000)
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
        displayMessage: "Could not unban the user.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
