import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Tag {
  id: string,
  title: string,
  type: string
}

@Component({
  selector: 'app-edit-recommended-search',
  templateUrl: './edit-recommended-search.component.html',
  styleUrls: ['./edit-recommended-search.component.less']
})
export class EditRecommendedSearchComponent implements OnInit {

  public searchId: string = null;

  public editRecommendedSearchForm: FormGroup;

  public selectedImage: any = null;

  public searchText: string = null;
  public existingIconUrl: string = null;
  
  public tags: Tag[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('searchId')) {

        this.searchId = paramMap.get('searchId');
        
        this.getTags();
        this.loadData();

        
      } else {
        // go back to venue list
        this.router.navigateByUrl('/recommended-searches');
      }
    })

    this.editRecommendedSearchForm = new FormGroup({
      text: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      icon: new FormControl("", {
        validators: []
      }),
      colour: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      connectedTag: new FormControl("", {
        validators: [
          Validators.required
        ]
      })
    })

    this.editRecommendedSearchForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.icon) {
        this.editRecommendedSearchForm.setErrors({
          tooBig: true
        })
      } else {
        this.editRecommendedSearchForm.setErrors(null)
      }
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/recommended-searches/get-recommended-search', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchId: this.searchId,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.searchText = request.responseData.recommendedSearch.text;
        this.existingIconUrl = request.responseData.recommendedSearch.iconUrl;
       
        this.editRecommendedSearchForm.patchValue({
          text: request.responseData.recommendedSearch.text,
          colour: request.responseData.recommendedSearch.colour,
          connectedTag: request.responseData.recommendedSearch.connectedTag ? request.responseData.recommendedSearch.connectedTag.id : null
        })
        
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
        displayMessage: "Could not load the recommended search.",
        unsanitizedMessage: error
      });

    }
  }

  private async getTags(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/tags/get-tags', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.tags = request.responseData.tags.sort((a, b) => a.title !== b.title ? a.title < b.title ? -1 : 1 : 0);

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

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onImageSelected(event: any): void {

    var reader = new FileReader();

    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.editRecommendedSearchForm.setErrors({
          tooBig: true
        })

      } else {

        this.editRecommendedSearchForm.setErrors(null);

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedImage = {
            buffer: readerLoadEvent.target.result,
            meta: {
              fileName: event.target.files[0].name,
              fileType: event.target.files[0].type
            }
          }
          this.onUserInputEvent();
        }

      }

    }
  }

  public removeIcon(): void {
    this.existingIconUrl = null;
  }

  public async editRecommendedSearch(): Promise<void> {
    try {

      if (!this.editRecommendedSearchForm.valid || (!this.existingIconUrl && !this.selectedImage)) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/recommended-searches/edit-recommended-search', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchId: this.searchId,
        text: this.editRecommendedSearchForm.value.text,
        icon: this.selectedImage,
        colour: this.editRecommendedSearchForm.value.colour,
        existingIconUrl: this.existingIconUrl,
        connectedTag: this.editRecommendedSearchForm.value.connectedTag
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/recommended-searches`, {
          state: {
            recommendedSearchEdited: true
          }
        });
        
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
        displayMessage: "Could not edit the recommended search.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
