import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Tag {
  id: string,
  title: string,
  type: string
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.less']
})
export class TagsComponent implements OnInit {

  public tags: Tag[] = [];

  public showTags: Tag[] = [];
  public totalPageCount: number = 0;
  public currentPageNo: number = 1;
  public resultsPerPage: number = 10;
  public availablePages: number[] = [1,2,3,4,5];

  public searchForm: FormGroup;

  public createTagForm: FormGroup;
  public editTagForm: FormGroup;

  public pendingEditTagId: string = null;
  public pendingRemoveTagId: string = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loadData();

    this.createTagForm = new FormGroup({
      title: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      type: new FormControl("", {
        validators: [
          Validators.required,
        ]
      })
    })

    this.editTagForm = new FormGroup({
      title: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      type: new FormControl("", {
        validators: [
          Validators.required,
        ]
      })
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/tags/get-tags', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.tags = request.responseData.tags.sort((a, b) => a.title !== b.title ? a.title < b.title ? -1 : 1 : 0);
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
        displayMessage: "Could not load the tags.",
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

    this.showTags = this.tags.slice(skip, skip + this.resultsPerPage);

    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.tags.length / this.resultsPerPage);
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

  public async createTag(): Promise<void> {
    try {

      if (!this.createTagForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/tags/create-tag', {
        token: this.authService.getAuthenticationState().authenticationToken,
        title: this.createTagForm.value.title,
        type: this.createTagForm.value.type
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        window.location.reload();
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
        displayMessage: "Could not create tag.",
        unsanitizedMessage: error
      });

    }
  }

  public setPendingEditTag(tag: Tag) {
    this.pendingEditTagId = tag.id;

    this.editTagForm.patchValue({
      title: tag.title,
      type: tag.type,
    })
  }

  public async editTag(): Promise<void> {
    try {

      if (!this.editTagForm.valid || this.pendingEditTagId === null) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/tags/edit-tag', {
        token: this.authService.getAuthenticationState().authenticationToken,
        tagId: this.pendingEditTagId,
        title: this.editTagForm.value.title,
        type: this.editTagForm.value.type
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        // const tagIndex = this.tags.findIndex((x) => x.id === this.pendingRemoveTagId);

        // if (tagIndex > -1) {

        //   this.tags[tagIndex].title = this.editTagForm.value.title;
        //   this.tags[tagIndex].type = this.editTagForm.value.type;

        // }

        this.pendingEditTagId = null;

        window.location.reload();
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
        displayMessage: "Could not edit tag.",
        unsanitizedMessage: error
      });

    }
  }

  public async removeTag(): Promise<void> {
    try {

      if (this.pendingRemoveTagId === null) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/tags/remove-tag', {
        token: this.authService.getAuthenticationState().authenticationToken,
        tagId: this.pendingRemoveTagId,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        const tagIndex = this.tags.findIndex((x) => x.id === this.pendingRemoveTagId);

        if (tagIndex > -1) {

          this.tags.splice(tagIndex, 1);

        }

        this.pendingRemoveTagId = null;

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
        displayMessage: "Could not remove tag.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
