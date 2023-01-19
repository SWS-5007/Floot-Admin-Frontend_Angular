import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-create-recommended-search',
  templateUrl: './create-recommended-search.component.html',
  styleUrls: ['./create-recommended-search.component.less']
})
export class CreateRecommendedSearchComponent implements OnInit {

  public createRecommendedSearchForm: FormGroup;

  public selectedImage: any = null;
  
  public tags: Tag[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router
  ) {
    this.createRecommendedSearchForm = new FormGroup({
      text: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      icon: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),  
      colour: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),  
      connectedTag: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),  
    })

    this.getTags();

    this.createRecommendedSearchForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.icon) {
        this.createRecommendedSearchForm.setErrors({
          tooBig: true
        })
      } else {
        this.createRecommendedSearchForm.setErrors(null)
      }
    })
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onImageSelected(event: any): void {

    var reader = new FileReader();

    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.createRecommendedSearchForm.setErrors({
          tooBig: true
        })
        

      } else {

        this.createRecommendedSearchForm.setErrors(null);

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

  public async createRecommendedSearch(): Promise<void> {
    try {

      if (!this.createRecommendedSearchForm.valid || !this.selectedImage) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/recommended-searches/create-recommended-search', {
        token: this.authService.getAuthenticationState().authenticationToken,
        text: this.createRecommendedSearchForm.value.text,
        icon: this.selectedImage,
        colour: this.createRecommendedSearchForm.value.colour,
        connectedTag: this.createRecommendedSearchForm.value.connectedTag
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/recommended-searches`, {
          state: {
            recommendedSearchCreated: true
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
        displayMessage: "Could not create the recommended search.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
