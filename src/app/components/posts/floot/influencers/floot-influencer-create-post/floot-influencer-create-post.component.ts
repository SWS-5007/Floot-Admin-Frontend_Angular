import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Influencer {
  id: string,
  name: string,
  address: string
}

@Component({
  selector: 'app-floot-influencer-create-post',
  templateUrl: './floot-influencer-create-post.component.html',
  styleUrls: ['./floot-influencer-create-post.component.less']
})
export class FlootInfluencerCreatePostComponent implements OnInit {

  public influencers: Influencer[] = [];
  public createPostForm: FormGroup;

  public selectedImage: any = null;
  public fileExtension: string = null;

  public returnUrl: string = null;

  public addOptionsChecked: boolean = false;

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

    this.loadInfluencers();

    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.returnUrl) {
        this.returnUrl = this.router.getCurrentNavigation().extras.state.returnUrl;
      }
    }

    this.createPostForm = new FormGroup({
      influencerId: new FormControl('', {
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

  private async loadInfluencers(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/influencers/get-influencers', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.influencers = request.responseData.influencers.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);

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
        displayMessage: "Could not load the influencers.",
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

    var reader = new FileReader();

    
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

      let formattedQuestions: any[] = [];

      if (this.addOptionsChecked === true) {

        this.optionsArr.forEach((op, i) => {
          formattedQuestions.push((this.createPostForm.controls['optionsInput'] as FormArray).value[i] )
        })
      }

      
      
      const request: any = await this.http.post(environment.api + '/api/admin/influencer-posts/create-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.createPostForm.value.influencerId,
        caption: this.createPostForm.value.caption,
        image: this.selectedImage ? this.selectedImage : null,
        questionOptions: this.addOptionsChecked && formattedQuestions.length > 0 ? formattedQuestions : null,
        fileExtension: this.fileExtension,
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/posts/influencer', {
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
