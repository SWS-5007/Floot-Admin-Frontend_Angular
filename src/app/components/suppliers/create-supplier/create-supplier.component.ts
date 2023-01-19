import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.less']
})
export class CreateSupplierComponent implements OnInit {

  public address: any = null;

  public createSupplierForm: FormGroup;

  public selectedProfileImage: any = null;
  public selectedCoverImage: any = null;

  public profileImageError: boolean = false;
  public coverImageError: boolean = false;


  public websiteValidator: any = new RegExp(/^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router
  ) {
    this.createSupplierForm = new FormGroup({
      name: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      profileImage: new FormControl("", {
        validators: []
      }), 
      coverImage: new FormControl("", {
        validators: []
      }),   
      tagline: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }),
      website: new FormControl("", {
        validators: [
          Validators.required,
        ]
      }), 
    })

    this.createSupplierForm.valueChanges.subscribe(async(change: any) => {
      

      

      

      if (!this.selectedProfileImage && change.profileImage && change.profileImage !== '') {
        
        this.profileImageError = true

      } else {
        this.profileImageError = false
      }

      if (!this.selectedCoverImage && change.coverImage && change.coverImage !== '') {
        
        this.coverImageError = true
      } else {
        this.coverImageError = false
      }
    })
  }

  public onUserInputEvent(): void {
    this.pendingSaveService.setPendingChangeState(true);
  }

  public onProfileImageSelected(event: any): void {

    var reader = new FileReader();

    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.profileImageError = true

      } else {

        this.profileImageError = false

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedProfileImage = {
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

  public onCoverImageSelected(event: any): void {

    var reader = new FileReader();

    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.coverImageError = true

      } else {

        this.coverImageError = false

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedCoverImage = {
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

  public async createSupplier(): Promise<void> {
    try {

      

      if (!this.createSupplierForm.valid || !this.websiteValidator.test(this.createSupplierForm.value.website) || this.coverImageError || this.profileImageError) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/create-supplier', {
        token: this.authService.getAuthenticationState().authenticationToken,
        name: this.createSupplierForm.value.name,
        profileImage: this.selectedProfileImage,
        coverImage: this.selectedCoverImage,
        tagline: this.createSupplierForm.value.tagline,
        website: this.createSupplierForm.value.website
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/supplier-list/profile/${request.responseData.supplierId}`, {
          state: {
            supplierCreated: true
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
        displayMessage: "Could not load the supplier.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
