import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';
import Roles from 'src/app/types/roles';

interface Venue {
  id: string,
  name: string,
  profileImageUrl: string | null,
  address: string
}

@Component({
  selector: 'app-search-venues',
  templateUrl: './search-venues.component.html',
  styleUrls: ['./search-venues.component.less']
})
export class SearchVenuesComponent implements OnInit {

  public venues: Venue[] = [];

  public showVenues: Venue[] = [];
  public totalPageCount: number = 0;
  public totalVenueCount: number = 0;
  public currentPageNo: number = 1;
  public resultsPerPage: number = 10;
  public availablePages: number[] = [1,2,3,4,5];

  public searchForm: FormGroup;

  public venueDeleted: boolean = false;

  public activePermission: boolean = false;



  readonly displayOptions = {
    status: ['On board', 'To contact', 'In talks', 'Not interested'],
    loginsGiven: ['Done', 'Emailed', 'No'],
    city: ['Nottingham', 'Birmingham', 'Greenville', 'Manchester', 'Bristol', 'Derby', 'Orlando', 'Nashville', 'Leicester'],
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    const authState = this.authService.getAuthenticationState();
    
    if(authState.role === Roles.FlootAdmin) {
      this.activePermission = true;
    } else {
      this.activePermission = false;
    }

    if(this.router.getCurrentNavigation().extras.state) {

      if(this.router.getCurrentNavigation().extras.state.venueDeleted) {
        this.venueDeleted = true;

        setTimeout(() => {
          this.venueDeleted = false;
        }, 3000);
      }
    }


    this.searchForm = new FormGroup({
      searchText: new FormControl("", {
        updateOn: "change",
      }),
      searchCity: new FormControl("Nottingham", {
        updateOn: "change"
      })
    });

    this.searchVenues();
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

    this.showVenues = this.venues.slice(skip, skip + this.resultsPerPage);

    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.venues.length / this.resultsPerPage);
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

  public clearSearch(): void {
    this.searchForm.patchValue({
      searchText: null,
    })

    this.searchVenues();
  }

  public async searchVenues(): Promise<void> {
    try {

      if (this.searchForm.invalid) {
        return
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/get-venues', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchText: this.searchForm.value.searchText,
        searchCity: this.searchForm.value.searchCity
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.venues = request.responseData.venues.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);;
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
        displayMessage: 'Could not search venues.',
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
