import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Ticket {
  id: string,
  post: {
    id: string,
    caption: string,
    imageUrl: string | null,
    created: Date
  },
  reportedBy: {
    id: string,
    name: string
  },
  dateReported: Date,
  status: "open" | "resolved"
}

@Component({
  selector: 'app-search-reported-activity',
  templateUrl: './search-reported-activity.component.html',
  styleUrls: ['./search-reported-activity.component.less']
})
export class SearchReportedActivityComponent implements OnInit {

  public activity: Ticket[] = [];

  public showActivity: Ticket[] = [];
  public totalPageCount: number = 0;
  public currentPageNo: number = 1;
  public resultsPerPage: number = 10;
  public availablePages: number[] = [1,2,3,4,5];

  public ticketResolved: boolean = false;

  public selectedStatus: "open" | "closed" = "open";

  public pendingResolveTicketId: string = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if(this.router.getCurrentNavigation().extras.state) {

      if(this.router.getCurrentNavigation().extras.state.venueDeleted) {
        this.ticketResolved = true;

        setTimeout(() => {
          this.ticketResolved = false;
        }, 3000);
      }
    }

    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/reported-activity/get-reported-activity', {
        token: this.authService.getAuthenticationState().authenticationToken,
        status: this.selectedStatus
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.activity = request.responseData.reportedActivity;
        this.refreshList();
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
        displayMessage: "Could not load the reported activity.",
        unsanitizedMessage: error
      });

    }
  }

  public changeResultsNo(input: string) : void {
    if (Number(input)) {
      this.resultsPerPage = Number(input);
      this.refreshList();
    }
  }

  public changePageNo(input: string) : void {
    if (Number(input)) {
      this.currentPageNo = Number(input);
      this.refreshList();
    }
  }

  public refreshList(): void {

    let skip = 0;

    if (this.currentPageNo > 1) {
      skip = ((this.currentPageNo - 1) * this.resultsPerPage) - 1;
    }

    this.showActivity = this.activity.slice(skip, skip + this.resultsPerPage);

    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.activity.length / this.resultsPerPage);
    this.totalPageCount = totalPageCount;
    if (Number(this.currentPageNo)) {

      this.availablePages = [];

      if (this.totalPageCount <= 5) {
        for (let i = 0; i < totalPageCount; i) {
          this.availablePages.push(i+1)
          i++
        }
      } else if (totalPageCount - Number(this.currentPageNo) <= 2) {
        for (let i = 0; i < 5; i) {
          this.availablePages.push((totalPageCount - 5) + (i+1))
          i++
        }
      } else if ((totalPageCount > 5 && Number(this.currentPageNo)) <= 3) {
        for (let i = 0; i < 5; i) {
          this.availablePages.push(i+1);
          i++
        }
      } else {
        for (let i = 0; i < 5; i) {
          this.availablePages.push((Number(this.currentPageNo) - 2) + i)

          i++
        }
      }

    }
  }

  public async resolveTicket(): Promise<void> {
    try {

      if (!this.pendingResolveTicketId) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/reported-activity/resolve-ticket', {
        token: this.authService.getAuthenticationState().authenticationToken,
        ticketId: this.pendingResolveTicketId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        const ticketIndex = this.activity.findIndex((x) => x.id === this.pendingResolveTicketId);

        if (ticketIndex > -1) {
          this.activity.splice(ticketIndex, 1);
        }

        this.refreshList();

        this.ticketResolved = true;

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
