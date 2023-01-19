import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../core/error-handler.service';

/**
 *
 *
 * @export
 * @interface AuthSessionState
 *
 * Describes an authentication state, with the
 * token, and boolean for validation. If the
 * boolean is false, then no authencation token
 * should be provided.
 *
 */
export interface AuthSessionState {
  isAuthenticated: boolean,
  authenticationToken: string | null,
  role: number | null,
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   *
   * Fires when the state of the authentication changes
   * to ensure that all required API calls are performed
   * before the user is redirected.
   *
   * @memberof AuthService
   */
  public authStateChange = new EventEmitter();


  public accountHasUpdated = new EventEmitter();

  /**
   *
   * This holds the account object. If the account has not been
   * loaded, then this will be null, so ensure null check is
   * performed before operations.
   *
   * @type {*}
   * @memberof AuthService
   */
  public account: any = null;


  /**
   * Creates an instance of AuthService.
   * @memberof AuthService
   */
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  /**
   *
   * Removes the local auth token to sign the
   * user out.
   *
   * @memberof AuthService
   */
  public signOut(): void {
    window.localStorage.removeItem('authToken');
    this.authStateChange.emit();
    this.router.navigateByUrl('/authentication/sign-in')
  }

  /**
   *
   * Loads the accou
   *
   * @return {*}  {Promise<void>}
   * @memberof AuthService
   */
  public async loadAccount(): Promise<void> {
    try {
      const authState = this.getAuthenticationState();
      const request: any = await this.http.post(environment.api + '/api/admin/auth/identity/get-current-user', {
        token: authState.authenticationToken
      }).toPromise();

      console.log('loaded account: ', request)

      if(request.status === 'ok') {
        if(request.responseData.userValid) {
          this.account = request.responseData.user;

          // emit the account had updated event.
          this.accountHasUpdated.emit();

          window.localStorage.setItem('authToken', JSON.stringify({
            token: request.responseData.user.authToken,
            role: request.responseData.user.role
          }));

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not load account data',
            unsanitizedMessage: 'Nothing to report.'
          });
        }

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not load account data',
          unsanitizedMessage: 'Nothing to report.'
        });
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
   * @return {*}  {boolean}
   * @memberof AuthService
   */
  public getAuthenticationState(): AuthSessionState {
    if(window.localStorage.getItem('authToken')) {
      const data = JSON.parse(window.localStorage.getItem('authToken'))
      console.log('parsed data: ', {
        data
      })

      return <AuthSessionState> {
        isAuthenticated: true,
        authenticationToken: data.token,
        role: data.role,
      };

    }
    else {
      return <AuthSessionState>{
        isAuthenticated: false
        // isAuthenticated: true
      };
    }
  }

  public passwordValidator(password: string): boolean {
  
    if (password.length < 6) {
      return false;
    }
  
    let containsUppercase = false;
  
    for (var i=0; i<password.length; i++){
      if (password.charAt(i) == password.charAt(i).toUpperCase() && password.charAt(i).match(/[a-z]/i)){
        containsUppercase = true;
      }
    }
    
    if (containsUppercase === false) {
      return false;
    }
  
    let containsLowercase = false;
  
    for (var i=0; i<password.length; i++){
      if (password.charAt(i) == password.charAt(i).toLowerCase() && password.charAt(i).match(/[a-z]/i)){
        containsLowercase = true;
      }
    }
  
    if (containsLowercase === false) {
      return false;
    }
  
    if (!(/[0-9]/.test(password))) {
      return false;
    }

    if (!(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))) {
      return false;
    }
  
    return true;
  
  }
}
