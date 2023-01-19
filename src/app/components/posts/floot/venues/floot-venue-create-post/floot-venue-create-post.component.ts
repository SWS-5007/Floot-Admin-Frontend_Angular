import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addListener } from 'process';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Venue {
  id: string,
  name: string,
  address: string
}

@Component({
  selector: 'app-create-post',
  templateUrl: './floot-venue-create-post.component.html',
  styleUrls: ['./floot-venue-create-post.component.less']
})
export class FlootVenueCreatePostComponent implements OnInit {

  public venues: Venue[] = [];
  public createPostForm: FormGroup;

  public selectedImage: any = null;
  public fileExtension: string = null;

  public returnUrl: string = null;

  public addOptionsChecked: boolean = false;

  public progress: number = 0;
  public posting: boolean = false;

  public optionsInput() : FormArray {
    return this.createPostForm.get('optionsInput') as FormArray;
  }

  public optionsArr: String[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.loadVenues();

    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.returnUrl) {
        this.returnUrl = this.router.getCurrentNavigation().extras.state.returnUrl;
      }
    }

    this.createPostForm = new FormGroup({
      venueId: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      caption: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(1200)
        ]
      }),
      optionsInput: this.fb.array([]),
    })

    for(let i = 0; i < 2; i++) {
      this.optionsArr.push('');
      (this.createPostForm.controls['optionsInput'] as FormArray).push(new FormControl("", {
        updateOn: "change",
      }));
    }

  }

  private async loadVenues(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/get-venues', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.venues = request.responseData.venues.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);

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
        displayMessage: "Could not load the venues.",
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

      if (!this.createPostForm.valid) {
        return;
      }

      let formattedQuestions: any[] = [];

      if (this.addOptionsChecked === true) {

        this.optionsArr.forEach((op, i) => {
          formattedQuestions.push((this.createPostForm.controls['optionsInput'] as FormArray).value[i] )
        })
      }

      
      
      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/create-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.createPostForm.value.venueId,
        caption: this.createPostForm.value.caption,
        image: this.selectedImage ? this.selectedImage : null,
        questionOptions: this.addOptionsChecked && formattedQuestions.length > 0 ? formattedQuestions : null,
        fileExtension: this.fileExtension,
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/posts/venue', {
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

  addOption() {

    if (this.optionsArr.length < 4) {

      this.pendingSaveService.setPendingChangeState(true);

      this.optionsArr.push('');

      (this.createPostForm.controls['optionsInput'] as FormArray).push(new FormControl("", {
        updateOn: "change",
        validators: [
          Validators.required
        ]
      }))
    }
  }

  removeOption(index: number) {

    if (this.optionsArr.length > 2) {

      this.pendingSaveService.setPendingChangeState(true);

      this.optionsArr.splice(index, 1);

      (this.createPostForm.controls['optionsInput'] as FormArray).removeAt(index)
    }
  }

}
