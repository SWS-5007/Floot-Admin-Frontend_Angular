import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-influencer-post',
  templateUrl: './create-influencer-post.component.html',
  styleUrls: ['./create-influencer-post.component.less']
})
export class CreateInfluencerPostComponent implements OnInit {

  public createPostForm: FormGroup;

  public selectedImage: any = null;
  public fileExtension: string = null;

  public returnUrl: string = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
  ) {

    this.createPostForm = new FormGroup({
      caption: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(1200)
        ]
      }),
    })
  }

  ngOnInit(): void {
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onImageSelected(event: any): void {

    var reader = new FileReader();

    console.log('here');

    if (event.target.files.length === 1) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (readerLoadEvent) => {
        this.selectedImage = {
          buffer: readerLoadEvent.target.result,
          meta: {
            fileName: event.target.files[0].name,
            fileType: event.target.files[0].type
          }
        }
        this.fileExtension = this.selectedImage.meta.fileType.replace(/(.*)\//g, '');
        this.onUserInputEvent();
      }
    }
  }

  public async createPost(): Promise<void> {
    try {

      if (!this.createPostForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencer-posts/create-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        caption: this.createPostForm.value.caption,
        image: this.selectedImage ? this.selectedImage : null,
        fileExtension: this.fileExtension
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/influencer-posts', {
          state: {
            postCreated: true
          }
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
        displayMessage: error.error && error.error.message ? error.error.message : "Could not create the post.",
        unsanitizedMessage: error
      });

    }
  }

}
