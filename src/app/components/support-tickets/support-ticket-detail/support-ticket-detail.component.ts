import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface User {
  id: string,
  name: string,
  venue: Venue
}

interface Venue {
  id: string,
  name: string,
  profileImageUrl: string | null,
  address: string,
}

@Component({
  selector: 'app-support-ticket-detail',
  templateUrl: './support-ticket-detail.component.html',
  styleUrls: ['./support-ticket-detail.component.less']
})
export class SupportTicketDetailComponent implements OnInit {

  public ticketId: string = null;

  public user: User = null;

  public title: string = null;
  public description: string = null;
  public imageUrl: string = null;

  public status: "open" | "resolved" = null;
  public dateReported: Date = null;

  public ticketResolved: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('ticketId')) {

        this.ticketId = paramMap.get('ticketId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('/support-tickets');
      }
    });
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/support-tickets/get-ticket', {
        token: this.authService.getAuthenticationState().authenticationToken,
        ticketId: this.ticketId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.title = request.responseData.title;
        this.description = request.responseData.description;
        this.imageUrl = request.responseData.imageUrl;
        this.user = request.responseData.reportedBy;
        this.dateReported = request.responseData.dateReported;
        this.status = request.responseData.status;
        
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
        displayMessage: "Could not load the ticket.",
        unsanitizedMessage: error
      });

    }
  }

  public async resolveTicket(): Promise<void> {
    try {

      if (!this.ticketId) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/support-tickets/resolve-ticket', {
        token: this.authService.getAuthenticationState().authenticationToken,
        ticketId: this.ticketId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.ticketResolved = true;
        this.status = 'resolved';

        setTimeout(() => {
          this.ticketResolved = false;
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
        displayMessage: "Could not resolve the ticket.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
