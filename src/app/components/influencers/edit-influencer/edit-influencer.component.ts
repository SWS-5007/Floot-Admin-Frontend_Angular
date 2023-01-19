import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-influencer',
  templateUrl: './edit-influencer.component.html',
  styleUrls: ['./edit-influencer.component.less']
})
export class EditInfluencerComponent implements OnInit {
  
  public influencerId: string = null;

  public editInfluencerForm: FormGroup;

  public selectedImage: any = null;

  public influencerName: string = null;
  public existingProfileImageUrl: string = null;
  

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('influencerId')) {

        this.influencerId = paramMap.get('influencerId');

        this.loadData();

      } else {
        // go back to influencer list
        this.router.navigateByUrl('/influencers');
      }
    })

    this.editInfluencerForm = new FormGroup({
      name: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      profileImage: new FormControl("", {
        validators: []
      }),
      
    })

    this.editInfluencerForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.profileImage) {
        this.editInfluencerForm.setErrors({
          tooBig: true
        })
      } else {
        this.editInfluencerForm.setErrors(null)
      }
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/get-influencer-basic-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.influencerName = request.responseData.influencer.name;
        this.existingProfileImageUrl = request.responseData.influencer.profileImageUrl;
       
        this.editInfluencerForm.patchValue({
          name: request.responseData.influencer.name,
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
        displayMessage: "Could not load the influencer.",
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

        this.editInfluencerForm.setErrors({
          tooBig: true
        })

      } else {

        this.editInfluencerForm.setErrors(null);

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

  public removeProfileImage(): void {
    this.existingProfileImageUrl = null;
  }

  public async editInfluencer(): Promise<void> {
    try {

      if (!this.editInfluencerForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/edit-influencer', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId,
        name: this.editInfluencerForm.value.name,
        profileImage: this.selectedImage,
        existingImage: this.existingProfileImageUrl
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/influencers/profile/${this.influencerId}`, {
          state: {
            influencerEdited: true
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
        displayMessage: "Could not edit the influencer.",
        unsanitizedMessage: error
      });

    }
  }


  ngOnInit(): void {
  }

}
