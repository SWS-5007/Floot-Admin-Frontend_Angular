import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.less']
})
export class EditSupplierComponent implements OnInit {

  public supplierId: string = null;

  public editSupplierForm: FormGroup;

  public selectedProfileImage: any = null;
  public selectedCoverImage: any = null;

  public supplierName: string = null;
  public existingProfileImageUrl: string = null;
  public existingCoverImageUrl: string = null;

  public profileImageError: boolean = false;
  public coverImageError: boolean = false;

  public websiteValidator: any = new RegExp(/^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('supplierId')) {

        this.supplierId = paramMap.get('supplierId');

        this.loadData();

      } else {
        // go back to venue list
        this.router.navigateByUrl('/supplier-list');
      }
    })

    this.editSupplierForm = new FormGroup({
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

    this.editSupplierForm.valueChanges.subscribe(async(change: any) => {
      

      

      if (!this.selectedProfileImage && change.profileImage) {
        this.profileImageError = true
      } else {
        this.profileImageError = false
      }

      if (!this.selectedCoverImage && change.coverImage) {
        this.coverImageError = true
      } else {
        this.coverImageError = false
      }
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/get-supplier-basic-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId
      }).toPromise();

      

      if(request.status === 'ok') {

        this.supplierName = request.responseData.supplier.name;
        this.existingProfileImageUrl = request.responseData.supplier.profileImageUrl;
        this.existingCoverImageUrl = request.responseData.supplier.coverImageUrl;
       
        this.editSupplierForm.patchValue({
          name: request.responseData.supplier.name,
          tagline: request.responseData.supplier.tagline,
          website: request.responseData.supplier.website
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
        displayMessage: "Could not load the supplier.",
        unsanitizedMessage: error
      });

    }
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

  public removeProfileImage(): void {
    this.existingProfileImageUrl = null;
  }

  public removeCoverImage(): void {
    this.existingCoverImageUrl = null;
  }

  public async editSupplier(): Promise<void> {
    try {

      if (!this.editSupplierForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/edit-supplier', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId,
        name: this.editSupplierForm.value.name,
        profileImage: this.selectedProfileImage,
        coverImage: this.selectedCoverImage,
        tagline: this.editSupplierForm.value.tagline,
        website: this.editSupplierForm.value.website,
        existingProfileImage: this.existingProfileImageUrl,
        existingCoverImage: this.existingCoverImageUrl,
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.pendingSaveService.setPendingChangeState(false);
        this.router.navigateByUrl(`/supplier-list/profile/${this.supplierId}`, {
          state: {
            supplierEdited: true
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
        displayMessage: "Could not edit the supplier.",
        unsanitizedMessage: error
      });

    }
  }

  ngOnInit(): void {
  }

}
