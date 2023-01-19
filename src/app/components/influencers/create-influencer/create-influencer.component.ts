import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-influencer',
  templateUrl: './create-influencer.component.html',
  styleUrls: ['./create-influencer.component.less']
})
export class CreateInfluencerComponent implements OnInit {

  //public address: any = null;

  public createInfluencerForm: FormGroup;

  public selectedImage: any = null;
  

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router
  ) {
    this.createInfluencerForm = new FormGroup({
      name: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      profileImage: new FormControl("", {
        validators: []
      }),    
    })

    this.createInfluencerForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedImage)

      if (!this.selectedImage && change.profileImage) {
        this.createInfluencerForm.setErrors({
          tooBig: true
        })
      } else {
        this.createInfluencerForm.setErrors(null)
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

        this.createInfluencerForm.setErrors({
          tooBig: true
        })

      } else {

        this.createInfluencerForm.setErrors(null);

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

  public async createInfluencer(): Promise<void> {
    try {
      if (!this.createInfluencerForm.valid) {
        return;
        
      }
      const request: any = await this.http.post(environment.api + '/api/admin/influencers/create-influencer', {
        
        token: this.authService.getAuthenticationState().authenticationToken,
        name: this.createInfluencerForm.value.name,
        profileImage: this.selectedImage,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        console.log("request status === ok")
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/influencers/profile/${request.responseData.influencerId}`, {
          state: {
            influencerCreated: true
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
        displayMessage: "Could not load the influencer.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
