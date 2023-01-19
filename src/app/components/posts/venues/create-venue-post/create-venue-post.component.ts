import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { VenueHandlerService } from 'src/app/services/identity/venue-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-venue-post',
  templateUrl: './create-venue-post.component.html',
  styleUrls: ['./create-venue-post.component.less']
})
export class CreateVenuePostComponent implements OnInit {
  public createPostForm: FormGroup;

  public selectedImage: any = null;
  public fileExtension: string = null;

  public returnUrl: string = null;
  public selectedVenueId: string = null;
  public selectedVenueName: string = null;

  public progress: number = 0;
  public posting: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private venueHanlder: VenueHandlerService
  ) {
    if(!this.venueHanlder.venueExists) {
      this.venueHanlder.venueLoaded.subscribe(() =>{
        this.selectedVenueId = this.venueHanlder.getChosenVenueId();
        this.selectedVenueName = this.venueHanlder.getChosenVenueName();
      });
    } else {
      this.selectedVenueId = this.venueHanlder.getChosenVenueId();
      this.selectedVenueName = this.venueHanlder.getChosenVenueName();
    }
    

    this.venueHanlder.venueChange.subscribe(() => {
      this.selectedVenueId = this.venueHanlder.getChosenVenueId();
      this.selectedVenueName = this.venueHanlder.getChosenVenueName();
    });
    
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
        this.fileExtension = this.selectedImage.meta.fileType.replace(/(.*)\//g, '');
        this.onUserInputEvent();
      }
    }
  }

  public async createPost(): Promise<void> {
    this.posting = true;
    try {
      console.log("using this post");

      if (!this.createPostForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/create-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        caption: this.createPostForm.value.caption,
        image: this.selectedImage ? this.selectedImage : null,
        fileExtension: this.fileExtension,
        chosenVenueId: this.selectedVenueId,
      }).toPromise();

      console.log(request);

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        console.log("navigation")
        console.log(this.returnUrl);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/venue-posts', {
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
    this.posting = false;
  }
}
