import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { VenueHandlerService } from 'src/app/services/identity/venue-handler.service';
import { environment } from 'src/environments/environment';

interface Post {
  id: string,
  caption: string,
  imageUrl: string | null,
  venue: {
    id: string,
    name: string
  } | null,
  created: Date
}

@Component({
  selector: 'app-my-venue-posts',
  templateUrl: './my-venue-posts.component.html',
  styleUrls: ['./my-venue-posts.component.less']
})
export class MyVenuePostsComponent implements OnInit {

  public posts: Post[] = [];

  public showPosts: Post[] = [];
  public totalPageCount: number = 0;
  public totalPostCount: number = 0;
  public currentPageNo: number = 1;
  public resultsPerPage: number = 10;
  public availablePages: number[] = [1,2,3,4,5];

  public searchForm: FormGroup;

  public pendingDeletePostId: string = null;

  public postDeleted: boolean = false;
  public postCreated: boolean = false;
  public postEdited: boolean = false;

  public selectedVenueName: string = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private venueHandler: VenueHandlerService
  ) {
    if(!this.venueHandler.venueExists) {
      this.venueHandler.venueLoaded.subscribe(() => {
        this.selectedVenueName = this.venueHandler.getChosenVenueName();
        this.loadData();
      });
    }else {
      this.selectedVenueName = this.venueHandler.getChosenVenueName();
      this.loadData();
    }

    this.venueHandler.venueChange.subscribe(() => {
      this.selectedVenueName = this.venueHandler.getChosenVenueName();
      this.loadData();
    });

    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.postEdited) {
        this.postEdited = true

        setTimeout(() => {
          this.postEdited = false;
        }, 3000);
      }

      if(this.router.getCurrentNavigation().extras.state.postCreated) {
        this.postCreated = true

        setTimeout(() => {
          this.postCreated = false;
        }, 3000);
      }
    }

    this.searchForm = new FormGroup({
      searchText: new FormControl("", {
        updateOn: "change",
      }),
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/get-venue-posts', {
        token: this.authService.getAuthenticationState().authenticationToken,
        chosenVenueId: this.venueHandler.getChosenVenueId()
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.posts = request.responseData.posts.map((post: Post) => {
          return {
            id: post.id,
            imageUrl: post.imageUrl,
            caption: post.caption.slice(0, 50),
            created: post.created
          }
        });

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
        displayMessage: "Could not load the posts.",
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

    this.showPosts = this.posts.slice(skip, skip + this.resultsPerPage);

    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.posts.length / this.resultsPerPage);
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
      venueId: null
    })

    this.loadData();
  }

  public async searchPosts(): Promise<void> {
    try {

      if (this.searchForm.invalid) {
        return
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/get-venue-posts', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchText: this.searchForm.value.searchText,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.posts = request.responseData.posts.map((post: Post) => {
          return {
            id: post.id,
            imageUrl: post.imageUrl,
            caption: post.caption.slice(0, 50),
            venue: post.venue,
            created: post.created
          }
        });
        
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
        displayMessage: 'Could not search posts.',
        unsanitizedMessage: error
      });

    }
  }

  public async deletePost(): Promise<void> {
    try {

      if (!this.pendingDeletePostId) {
        return
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/delete-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        postId: this.pendingDeletePostId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        const postIndex = this.posts.findIndex((x) => x.id === this.pendingDeletePostId);

        if (postIndex > -1) {

          this.posts.splice(postIndex, 1);
          this.refreshList();

        }
        
        this.postDeleted = true;

        setTimeout(() => {
          this.postDeleted = false;
        }, 2000)

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
        displayMessage: 'Could not delete the post.',
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
