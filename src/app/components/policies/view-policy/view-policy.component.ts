import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-policy',
  templateUrl: './view-policy.component.html',
  styleUrls: ['./view-policy.component.less']
})
export class ViewPolicyComponent implements OnInit {

  public policyId: string = null;
  public title: string = null;
  public content: string = null;
  public lastUpdated: Date = null;

  public policyEdited: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('policyId')) {

        this.policyId = paramMap.get('policyId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('/policies');
      }
    });

    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.policyEdited) {
        this.policyEdited = true

        setTimeout(() => {
          this.policyEdited = false;
        }, 3000);
      }
      
    }
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
        this.content = request.responseData.content;
        this.lastUpdated = request.responseData.lastUpdated;

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
