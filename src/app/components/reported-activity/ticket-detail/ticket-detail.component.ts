import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface User {
  id: string,
  name: string
}

interface Post {
  id: string,
  caption: string,
  imageUrl: string | null,
  created: Date
}

interface Venue {
  id: string,
  name: string,
  profileImageUrl: string | null,
  address: string,
}

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.less']
})
export class TicketDetailComponent implements OnInit {

  public ticketId: string = null;

  public user: User = null;

  public post: Post = null;
  public venue: Venue = null;

  public status: "open" | "resolved" = null;
  public dateReported: Date = null;

  public ticketResolved: boolean = false;
  public postDeleted: boolean = false;

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
        this.router.navigateByUrl('/reported-activity');
      }
    });
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/reported-activity/get-ticket', {
        token: this.authService.getAuthenticationState().authenticationToken,
        ticketId: this.ticketId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.user = request.responseData.reportedBy;
        this.post = request.responseData.post;
        this.venue = request.responseData.venue;
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

      const request: any = await this.http.post(environment.api + '/api/admin/reported-activity/resolve-ticket', {
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

  public async deletePost(): Promise<void> {
    try {

      if (!this.post || !this.post.id) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/posts/delete-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        postId: this.post.id
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.postDeleted = true;
        this.post = null;

        setTimeout(() => {
          this.postDeleted = false;
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
