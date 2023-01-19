import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import Roles from 'src/app/types/roles';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  public termsConditionsCheckbox: boolean = false;
  public termsConditionsPopup: boolean = false;
  public termsConditionsError: boolean = false;
  public termsConditionsFull: string;

  public error: string = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {

    // retrieve terms and conditions from database
    // const loadTermsConditions =async () => {
    //   try {
    //     const request: any = await this.http.post(environment.api + '/api/admin/policies/get-policy', {
    //       policyId: "terms-and-conditions"
    //     }).toPromise();

    //     if(request.status === 'ok') {
    //       this.termsConditionsFull = request.responseData.content;
    //     }else{
    //       console.log("failed to retrieve terms and conditions.");
    //     }

    //     }
    //   catch(error){
    //       console.log(error);
    //     }
    // }
    // loadTermsConditions();


    this.http.get('assets/policies/terms-conditions', {responseType: 'text'}).subscribe(data => {this.termsConditionsFull = data});

    /**
     * Check if the user should be here.
     *
     */
    if(this.authService.getAuthenticationState().isAuthenticated) {
      this.router.navigate(['/']);
    }

    // keydown listerner for enter key press to submit request
    window.addEventListener('keydown', async (event: Event | any) => {
      if(event.keyCode && event.keyCode == 13) {
        if(this.email && this.password) {
          await this.performLoginRequest();
        }
      }
    })

  }


  /**
   *
   *
   * @memberof LoginComponent
   */
  public dismissError(): void {
    this.error = null;
  }

  /**
   *
   * Attempt the sign the user in throught the backend
   * API auth service.
   *
   * @return {*}  {Promise<void>}
   * @memberof LoginComponent
   */
  public async performLoginRequest(): Promise<void> {

    // Checks if user has accepted the terms and conditions.
    if(this.termsConditionsCheckbox){
      try {
        // reset the authentication error state
        this.error = null;
  
        const request: any = await this.http.post(environment.api + '/api/admin/auth/login', {
          email: this.email,
          password: this.password
        }).toPromise();
  
        if(request.status === 'ok') {
          if(request.responseData.authValid) {
            window.localStorage.setItem('authToken',
            JSON.stringify({
              token: request.responseData.authToken,
              role: request.responseData.role
            }));
  
            this.authService.authStateChange.emit();
            console.log("route hit!")
            console.log("omar is:" + request.responseData.role)
            if (request.responseData.role === Roles.FlootAdmin) {
              this.router.navigate(['/users']);
            } 
            else if (request.responseData.role === Roles.InfluencerAdmin){
              this.router.navigate(['/influencer-posts']);
            } 
            else {
              this.router.navigate(['/venue-posts']);
            }
  
          }
          else {
            this.error = 'Your email or password is incorrect.';
          }
  
        }
        else {
          this.error = request.message;
        }
  
      }
      catch(error) {
        console.log(error)
        this.errorHandlerService.throwError({
          displayMessage: error.error && error.error.message ? error.error.message : "Invalid request",
          unsanitizedMessage: error
        });
      }
    }else{
      this.termsConditionsError = true;
      document.getElementById("terms-conditions-button").style.textDecoration = "red underline";
      document.getElementById("terms-conditions-button").style.color = "red";
      document.getElementById("terms-conditions-label").style.color = "red";  
    }

    
  }

  // Toggles the t&cs popup
  toggleTermsConditionsPopup(toggle: boolean): void {
    if(toggle){
      this.termsConditionsPopup = true;
    }else{
      this.termsConditionsPopup = false;
    }
  }

  ngOnInit(): void {
  }

}
const overFlowToggle = ()=>{
  // Stops any overflow on the login page
  setTimeout(()=>{
    const sidebar = document.querySelector(".form-sidebar");
    if (sidebar !== null){
      // Stop overflow
      const bod = document.querySelector("body");
      bod.style.overflowX = "hidden";
      bod.style.overflowY = "hidden";
    }
  },100) // This could be lower but seems to work.

}
overFlowToggle()