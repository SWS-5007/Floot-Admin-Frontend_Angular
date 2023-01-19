import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  public accountName: string = 'Loading...';
  public shouldAccountNameDisplay: boolean = true;

  /**
   * Creates an instance of NavbarComponent.
   * @param {AuthService} authService
   * @param {ErrorHandlerService} errorHandlerService
   * @memberof NavbarComponent
   */
  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService

  ) { 
    this.loadAccountData();

    // watch for changes in the user account.
    this.authService.accountHasUpdated.subscribe(() => {
      this.loadAccountData();
    });
  }

  /**
   *
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof NavbarComponent
   */
  private async loadAccountData(): Promise<void> {
    try {
      if(this.authService.getAuthenticationState().isAuthenticated) {
        if(!this.authService.account) {
          await this.authService.loadAccount();
        }

        this.accountName = this.authService.account.name;
      }
      else {
        this.shouldAccountNameDisplay = false;
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load account data',
        unsanitizedMessage: error
      });
    }
  }

  /**
   *
   *
   * @memberof NavbarComponent
   */
  public signOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
  }

}
