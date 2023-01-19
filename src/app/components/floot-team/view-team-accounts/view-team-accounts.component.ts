import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Account {
  id: string,
  firstName: string,
  lastName: string,
  email: string
}

@Component({
  selector: 'app-view-team-accounts',
  templateUrl: './view-team-accounts.component.html',
  styleUrls: ['./view-team-accounts.component.less']
})
export class ViewTeamAccountsComponent implements OnInit {

  public accounts: Account[] = [];

  public pendingDeleteId: string = "";

  public userDeleted: boolean = false;
  public userEdited: boolean = false;
  public userCreated: boolean = false;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    public pendingSaveService: PendingSaveService,
    private router: Router
  ) {

  if((this.router.getCurrentNavigation() as any).extras.state) {

    const routeState = (this.router.getCurrentNavigation() as any).extras.state;

    if (routeState.userEdited === true) {
      this.userEdited = true;

      setTimeout(() => {
        this.userEdited = false;
      }, 3000)
    }

    if (routeState.userCreated === true) {
      this.userCreated = true;

      setTimeout(() => {
        this.userCreated = false;
      }, 3000)
    }
  }

    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/accounts/floot/get-accounts', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.accounts = request.responseData.accounts.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);;

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not load accounts.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load accounts.',
        unsanitizedMessage: error
      });

    }
  }

  public setPendingDeleteId(id: string): void {
    this.pendingDeleteId = id
  }

  public async deleteUser(): Promise<void> {
    try {

      const pendingDeleteUser = this.accounts.findIndex(x => x.id === this.pendingDeleteId);

      if (pendingDeleteUser > -1) {

        if (this.accounts[pendingDeleteUser].email === this.authService.account.email) {
          // They are trying to delete their own account
          return;
        }

        const request: any = await this.http.post(environment.api + '/api/admin/accounts/delete-account', {
          token: this.authService.getAuthenticationState().authenticationToken,
          accountId: this.pendingDeleteId,
        }).toPromise();

        if(request.status === 'ok' && request.responseData.userDeleted === true) {

          const userIndex = this.accounts.findIndex(x => x.id === this.pendingDeleteId);
          if (userIndex > -1) {
            this.accounts.splice(userIndex, 1);
          }

          this.pendingDeleteId = '';

          this.userDeleted = true;

          setTimeout(() => {
            this.userDeleted = false;
          }, 3000)

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not delete account.',
            unsanitizedMessage: 'No stack trace.'
          });
        }
      }


    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not delete account.',
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
