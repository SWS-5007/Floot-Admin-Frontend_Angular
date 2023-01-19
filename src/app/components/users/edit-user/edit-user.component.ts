import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {

  public userId: string = null;

  public selectedImage: any = null;

  public userName: string = null;
  public existingProfileImageUrl: string = null;

  public editUserForm: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('userId')) {

        this.userId = paramMap.get('userId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('/users');
      }
    })

    this.editUserForm = new FormGroup({
      firstName: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      lastName: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      profileImage: new FormControl("", {
        validators: []
      }),
      email: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      dateOfBirth: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/users/account/get-user-account-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        userId: this.userId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.userName = request.responseData.user.firstName + " " + request.responseData.user.lastName;
        this.existingProfileImageUrl = request.responseData.user.profileImageUrl;
       
        this.editUserForm.patchValue({
          firstName: request.responseData.user.firstName,
          lastName: request.responseData.user.lastName,
          email: request.responseData.user.email,
          dateOfBirth: this.formatDate(request.responseData.user.dateOfBirth),
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
        displayMessage: "Could not load the user.",
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

  public removeProfileImage(): void {
    this.existingProfileImageUrl = null;
  }

  public async saveChanges(): Promise<void> {
    try {

      if (!this.editUserForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/users/account/edit-user', {
        token: this.authService.getAuthenticationState().authenticationToken,
        userId: this.userId,
        firstName: this.editUserForm.value.firstName,
        lastName: this.editUserForm.value.lastName,
        profileImage: this.selectedImage,
        email: this.editUserForm.value.email,
        dateOfBirth: new Date(this.editUserForm.value.dateOfBirth)
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/users/${this.userId}`, {
          state: {
            userEdited: true
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
        displayMessage: "Could not edit the user.",
        unsanitizedMessage: error
      });

    }
  }

  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  ngOnInit(): void {
  }

}
