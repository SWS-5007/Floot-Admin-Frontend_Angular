import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface RecommendedSearches {
  id: string,
  text: string,
  iconUrl: string | null,
  colour: string,
  connectedTag: {
    title: string,
    type: string
  }
}

@Component({
  selector: 'app-view-recommended-searches',
  templateUrl: './view-recommended-searches.component.html',
  styleUrls: ['./view-recommended-searches.component.less']
})
export class ViewRecommendedSearchesComponent implements OnInit {

  public recommendedSearches: RecommendedSearches[] = [];

  public showRecommendedSearches: RecommendedSearches[] = [];
  public totalPageCount: number = 0;
  public currentPageNo: number = 1;
  public resultsPerPage: number = 10;
  public availablePages: number[] = [1,2,3,4,5];

  public searchForm: FormGroup;

  public recommendedSearchDeleted: boolean = false;
  public recommendedSearchCreated: boolean = false;
  public recommendedSearchEdited: boolean = false;

  public pendingDeleteSearchId: string = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    if(this.router.getCurrentNavigation().extras.state) {

      if(this.router.getCurrentNavigation().extras.state.recommendedSearchDeleted) {
        this.recommendedSearchDeleted = true;

        setTimeout(() => {
          this.recommendedSearchDeleted = false;
        }, 3000);
      }

      if(this.router.getCurrentNavigation().extras.state.recommendedSearchCreated) {
        this.recommendedSearchCreated = true;

        setTimeout(() => {
          this.recommendedSearchCreated = false;
        }, 3000);
      }

      if(this.router.getCurrentNavigation().extras.state.recommendedSearchEdited) {
        this.recommendedSearchEdited = true;

        setTimeout(() => {
          this.recommendedSearchEdited = false;
        }, 3000);
      }
    }

    this.loadData();

    this.searchForm = new FormGroup({
      searchText: new FormControl("", {
        updateOn: "change",
      }),
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/recommended-searches/get-recommended-searches', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.recommendedSearches = request.responseData.recommendedSearches;
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
        displayMessage: "Could not load the recommended searches.",
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

    this.showRecommendedSearches = this.recommendedSearches.slice(skip, skip + this.resultsPerPage);

    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.recommendedSearches.length / this.resultsPerPage);
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

    this.loadData();
  }

  public async searchRecommendedSearches(): Promise<void> {
    try {

      if (this.searchForm.invalid) {
        return
      }

      const request: any = await this.http.post(environment.api + '/api/admin/recommended-searches/get-recommended-searches', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchText: this.searchForm.value.searchText
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.recommendedSearches = request.responseData.recommendedSearches;
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

  public async deleteRecommendedSearch(): Promise<void> {
    try {

      if (!this.pendingDeleteSearchId) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/recommended-searches/delete-recommended-search', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchId: this.pendingDeleteSearchId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        const index = this.recommendedSearches.findIndex((x) => x.id === this.pendingDeleteSearchId);

        if (index > -1) {
          this.recommendedSearches.splice(index, 1);
        }
        
        this.pendingDeleteSearchId = null;

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
        displayMessage: "Could not delete the recommended search.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
