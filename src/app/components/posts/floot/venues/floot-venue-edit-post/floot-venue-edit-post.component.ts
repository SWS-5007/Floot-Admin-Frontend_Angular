import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Venue {
  id: string,
  name: string,
  address: string
}

interface Question {
  options: string[]
}

interface Post {
  id: string,
  caption: string,
  imageUrl: string | null,
  question: Question | null,
  venue: {
    id: string,
    name: string
  } | null
}

@Component({
  selector: 'app-floot-venue-edit-post',
  templateUrl: './floot-venue-edit-post.component.html',
  styleUrls: ['./floot-venue-edit-post.component.less']
})
export class FlootVenueEditPostComponent implements OnInit {

  public postId: string = null;

  public post: Post = null;

  public editPostForm: FormGroup;

  public selectedImage: any = null;
  public existingPostImageUrl: string = null;

  public returnUrl: string = null;

  public progress: number = 0;
  public posting: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {

        this.postId = paramMap.get('postId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('venue/posts');
      }
    })

    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.returnUrl) {
        this.returnUrl = this.router.getCurrentNavigation().extras.state.returnUrl;
      }
    }

    this.editPostForm = new FormGroup({
      caption: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(250)
        ]
      }),
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/get-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        postId: this.postId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.post = request.responseData.post;
       
        this.existingPostImageUrl = request.responseData.post.imageUrl;

        this.editPostForm.patchValue({
          caption: request.responseData.post.caption
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
        displayMessage: "Could not load the post.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onImageSelected(event: any): void {
    this.progress = 0;
    var reader = new FileReader();

    
    if (event.target.files.length === 1) {
      reader.onloadstart = (readerLoadEvent) => {
        this.progress = 1;
      }

      reader.onprogress = (readerLoadEvent) => {
        this.progress = (readerLoadEvent.loaded / event.target.files[0].size) * 100;
      }

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (readerLoadEvent) => {
        this.progress = 100;
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

  public removeImage(): void {
    this.existingPostImageUrl = null;
  }

  public async editPost(): Promise<void> {
    this.posting = true;
    try {

      if (!this.editPostForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/edit-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        postId: this.postId,
        caption: this.editPostForm.value.caption,
        image: this.selectedImage ? this.selectedImage : null,
        existingImage: this.existingPostImageUrl
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : 'posts/venue', {
          state: {
            postEdited: true
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
        displayMessage: "Could not create the post.",
        unsanitizedMessage: error
      });

    }
    this.posting = false;
  }
}
