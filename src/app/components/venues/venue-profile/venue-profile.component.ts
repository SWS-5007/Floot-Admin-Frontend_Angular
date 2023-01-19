import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import Roles from 'src/app/types/roles';
import { environment } from 'src/environments/environment';
//import { AppComponent, getChosenVenueId } from 'src/app/app.component';
import { VenueHandlerService } from 'src/app/services/identity/venue-handler.service';
import { VRMFormData } from 'src/app/modals/update-vrm-info-modal/update-vrm-info-modal.component';
import { AddMenuForm } from 'src/app/modals/add-menu-modal/add-menu-modal.component';
import { ImageFormData } from 'src/app/modals/add-image-modal/add-image-modal.component';

export interface BasicInfo {
  name: string,
  address: any,
  description: string
}

export interface Locale {
  country: string,
  region: string,
  city: string
}

export interface GalleryImage {
  id: string,
  url: string,
  showDelete: boolean,
}

export interface VenueAdmin {
  id: string,
  name: string,
  email: string
}

export interface Menu {
  id: string,
  title: string,
  url: string,
}

export interface Tag {
  id: string,
  title: string,
  type: string
}

export interface Post {
  id: string,
  caption: string,
  imageUrl: string | null,
  venue: {
    id: string,
    name: string
  } | null,
  created: Date
}

export interface OpeningTimes {
  monday: {
    open: number | null,
    close: number | null
  } | null,
  tuesday: {
    open: number | null,
    close: number | null
  } | null,
  wednesday: {
    open: number | null,
    close: number | null
  } | null,
  thursday: {
    open: number | null,
    close: number | null
  } | null,
  friday: {
    open: number | null,
    close: number | null
  } | null,
  saturday: {
    open: number | null,
    close: number | null
  } | null,
  sunday: {
    open: number | null,
    close: number | null
  } | null
}

export interface ExternalLink {
  text: string,
  url: string
}

export interface Vrm {
  status: string,
  lastVisitBy: string,
  lastVisit: string,
  loginsGiven: string,
  marketingConsent: string,
  lastPhotoshoot: string,
  cloudDir: string,
  assignee: string,
  note: string
}

export interface FileData{
  buffer: string | ArrayBuffer,
  meta: {
    fileName: string,
    fileType: string
  }
}

@Component({
  selector: 'app-venue-profile',
  templateUrl: './venue-profile.component.html',
  styleUrls: ['./venue-profile.component.less']
})
export class VenueProfileComponent {

  public venueId: string = null;
  public basicInfo: BasicInfo = null;
  public locale: Locale = null;
  public localeConcat: string = null;
  public galleryImages: GalleryImage[] = [];
  public menuDescription: string = null;
  public menus: Menu[] = [];
  public venueAdmins: VenueAdmin[] = [];
  public status: "active" | "hidden" | "deleted" = null;

  public posts: Post[] = [];

  public tags: Tag[] = [];

  public email: string = null;
  public phoneNumber: string = null;

  public externalLink: ExternalLink = null;

  public addImageForm: FormGroup = null;
  public addMenuForm: FormGroup = null;
  public editDescriptionForm: FormGroup = null;

  public vrm: Vrm = null;
  
  public selectedNewGalleryImage: any = null;
  public selectedNewMenuPdf: any = null;

  public availableTags: Tag[] = [];

  public openingTimes: OpeningTimes = null;

  public venueEdited: boolean = false;
  public venueCreated: boolean = false;
  public postEdited: boolean = false;
  public postCreated: boolean = false;
  public adminAccountDeleted: boolean = false; // TODO: Frontend
  public adminAccountEdited: boolean = false; // TODO: Return URL
  public venueMarkedAsActive: boolean = false;
  public venueMarkedAsHidden: boolean = false;
  public openingTimesUpdated: boolean = false;
  public externalLinkUpdated: boolean = false;

  public pendingDeleteImageId: string = null;
  public pendingDeleteMenuId: string = null;
  public pendingDeleteAdminAccountId: string = null;

  public vrms;

  public viewImage: string = null;

  public activePermission: boolean = false;

  public chosenVenueLoaded: boolean = false;



  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private venueHandler: VenueHandlerService
  ) {

    const authState = this.authService.getAuthenticationState();
    
    if(authState.role === Roles.FlootAdmin) {
      this.activePermission = true;
    } else {
      this.activePermission = false;
    }
    
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('venueId')) {
        this.venueId = paramMap.get('venueId');
        this.loadData();
      } else {
        // go back the admin's assigned venue
        if(!this.venueHandler.venueExists && this.venueHandler.shouldDisplayVenueChoice) {
          this.venueHandler.venueLoaded.subscribe(() => {
            this.venueId = this.venueHandler.getChosenVenueId();
          });
        } else {
          this.venueId = this.venueHandler.getChosenVenueId();
          this.loadData();
        }
      }
    });

  
    this.getTags();
    
  
    if(this.router.getCurrentNavigation().extras.state) {
      if(this.router.getCurrentNavigation().extras.state.postEdited) {
        this.postEdited = true
  
        setTimeout(() => {
          this.postEdited = false;
        }, 3000);
      }
  
      if(this.router.getCurrentNavigation().extras.state.postCreated) {
        this.postCreated = true
  
        setTimeout(() => {
          this.postCreated = false;
        }, 3000);
      }
  
      if(this.router.getCurrentNavigation().extras.state.venueEdited) {
        this.venueEdited = true
  
        setTimeout(() => {
          this.venueEdited = false;
        }, 3000);
      }
  
      if(this.router.getCurrentNavigation().extras.state.venueCreated) {
        this.venueCreated = true
  
        setTimeout(() => {
          this.venueCreated = false;
        }, 3000);
      }
      
    }
    this.loadForms();

    
    if(this.venueHandler.shouldDisplayVenueChoice) {
      this.venueHandler.venueChange.subscribe(() => {
        this.venueId = this.venueHandler.getChosenVenueId();
        this.loadData();
      });
    }
    
  }

  public loadForms() {
    this.addImageForm = new FormGroup({
      image: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      caption: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });

    this.addMenuForm = new FormGroup({
      pdf: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      title: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });

    this.editDescriptionForm = new FormGroup({
      description: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(500)
        ]
      })
    })


    this.addMenuForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedNewMenuPdf)

      if (!this.selectedNewMenuPdf && change.pdf) {
        this.addMenuForm.setErrors({
          tooBig: true
        })
      } else {
        this.addMenuForm.setErrors(null)
      }
    })

    this.addImageForm.valueChanges.subscribe(async(change: any) => {
      console.log('change: ', change)

      console.log(this.selectedNewGalleryImage)

      if (!this.selectedNewGalleryImage && change.image) {
        this.addImageForm.setErrors({
          tooBig: true
        })
      } else {
        this.addImageForm.setErrors(null)
      }
    })
  }

  public onNewGalleryImageSelected(event: any): void {

    var reader = new FileReader();

    if (event.target.files.length === 1) {
      
      if (event.target.files[0].size > 50048576) {

        this.addImageForm.setErrors({
          tooBig: true
        })

      } else {

        this.addImageForm.setErrors(null)

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedNewGalleryImage = {
            buffer: readerLoadEvent.target.result,
            meta: {
              fileName: event.target.files[0].name,
              fileType: event.target.files[0].type
            }
          }
        }

      }

    }
  }

  public onNewMenuPdfSelected(event: any): void {

    var reader = new FileReader();

    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 500485760) {

        this.addMenuForm.setErrors({
          tooBig: true
        })

      } else {
        this.addMenuForm.setErrors(null);
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedNewMenuPdf = {
            buffer: readerLoadEvent.target.result,
            meta: {
              fileName: event.target.files[0].name,
              fileType: event.target.files[0].type
            }
          }
        }
      }

    }
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/get-venue-profile', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId ? this.venueId : null
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.basicInfo = request.responseData.venue.basicInfo;
        this.galleryImages = request.responseData.venue.galleryImages;

        this.galleryImages.forEach((image, index) => {
          this.galleryImages[index]['showDelete'] = false;
        });

        this.menus = request.responseData.venue.menus.menus;

        this.editDescriptionForm.patchValue({
          description: this.basicInfo.description
        });

        this.tags = request.responseData.venue.tags;

        this.posts = request.responseData.venue.posts;

        this.venueAdmins = request.responseData.venue.admins;

        this.status = request.responseData.venue.status;

        this.email = request.responseData.venue.contact.email;
        this.phoneNumber = request.responseData.venue.contact.phoneNumber;

        this.vrm = request.responseData.venue.vrm;
        this.locale = request.responseData.venue.locale;
        console.log(this.locale);
        if(this.locale) {
          this.localeConcat = this.locale.city + ", " + this.locale.region + ", " + this.locale.country;
        }
        console.log(this.localeConcat);
        
        this.openingTimes = request.responseData.venue.openingTimes;

        this.externalLink = request.responseData.venue.externalLink;

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
        displayMessage: "Could not load the venue.",
        unsanitizedMessage: error
      });

    }
  }

  private async getTags(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/tags/get-tags', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.availableTags = request.responseData.tags.sort((a, b) => a.title !== b.title ? a.title < b.title ? -1 : 1 : 0);
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
        displayMessage: "Could not load the tags.",
        unsanitizedMessage: error
      });

    }
  }

  public async uploadImage({caption, image}:ImageFormData): Promise<void> {
    try {

      if (this.galleryImages.length >= 12 || !image) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/upload-gallery-image', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        image: image,
        caption: caption
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        window.location.reload();
        
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
        displayMessage: "Could not upload the image.",
        unsanitizedMessage: error
      });

    }
  }

  public async deleteImage(imageId: string): Promise<void> {
    try {

      if(!imageId) return;

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/delete-gallery-image', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        imageId: imageId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        // const indexOfImage = this.galleryImages.findIndex(x => x.id === this.pendingDeleteImageId);

        // if (indexOfImage > -1) {
        //   this.galleryImages.splice(indexOfImage, 1);
        // }
        
        this.galleryImages = [...this.galleryImages.filter(image => image.id !== imageId)];
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
        displayMessage: "Could not delete the image.",
        unsanitizedMessage: error
      });

    }
  }

  public async uploadPdf({pdf, title}: AddMenuForm): Promise<void> {

    if(!pdf || !title) return;

    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/upload-menu-pdf', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        pdf: pdf,
        title: title
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        window.location.reload();
        
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
        displayMessage: "Could not upload the menu.",
        unsanitizedMessage: error
      });

    }
  }

  public async deleteMenu(menuId: string): Promise<void> {
    try {

      if (!menuId) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/delete-menu-pdf', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        menuId: menuId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.menus = [...this.menus.filter(menu => menu.id !== menuId)];
        
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
        displayMessage: "Could not delete the menu.",
        unsanitizedMessage: error
      });

    }
  }

  public async openMenuPdf(menuId: string): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/get-menu-pdf', {
        token: this.authService.getAuthenticationState().authenticationToken,
        menuId: menuId,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        window.open(request.responseData.url, '_blank').focus();
        
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
        displayMessage: "Could not load the menu.",
        unsanitizedMessage: error
      });

    }
  }

  public async editDescription(): Promise<void> {
    try {

      if (!this.editDescriptionForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/edit-description', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        description: this.editDescriptionForm.value.description
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.basicInfo.description = this.editDescriptionForm.value.description;
        
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
        displayMessage: "Could not edit the description.",
        unsanitizedMessage: error
      });

    }
  }

  public async editTags(tags: Tag[]): Promise<void> {
    try {

      console.log(tags);

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/set-tags', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        tags: tags.map((tag: Tag) => { return tag.id })
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.tags = [...tags];
        
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
        displayMessage: "Could not edit the tags.",
        unsanitizedMessage: error
      });

    }
  }

  public navigateToEditPost(postId: string): void {

    this.router.navigateByUrl(`/posts/venue/edit-post/${postId}`, {
      state: {
        returnUrl: `/venues/profile/${this.venueId}`
      }
    })

  }

  public navigateToCreatePost(): void {

    if (this.authService.account.role === Roles.FlootAdmin) {
      this.router.navigateByUrl(`/posts/venue/create-post`, {
        state: {
          returnUrl: `/venues/profile/${this.venueId}`
        }
      })

    } else {
      this.router.navigateByUrl('/venue-posts/create-post')
    }
  }

  public async deleteAdminAccount(adminId: string): Promise<void> {
    try {

      const pendingDeleteUser = this.venueAdmins.findIndex(x => x.id === adminId);

      if (pendingDeleteUser > -1) {

        if (this.venueAdmins[pendingDeleteUser].email === this.authService.account.email) {
          // They are trying to delete their own account
          return;
        }

        const request: any = await this.http.post(environment.api + '/api/admin/accounts/delete-account', {
          token: this.authService.getAuthenticationState().authenticationToken,
          accountId: adminId,
        }).toPromise();

        console.log(request)

        if(request.status === 'ok' && request.responseData.userDeleted === true) {

          const userIndex = this.venueAdmins.findIndex(x => x.id === adminId);
          if (userIndex > -1) {
            this.venueAdmins = [...this.venueAdmins.slice(userIndex, 1)];
          }

          this.adminAccountDeleted = true;

          setTimeout(() => {
            this.adminAccountDeleted = false;
          }, 3000)

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not delete account.',
            unsanitizedMessage: 'No stack trace.'
          });
        }
      }


    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not delete account.',
        unsanitizedMessage: error
      });

    }
  }

  public async deleteVenue(): Promise<void> {
    try {

        const request: any = await this.http.post(environment.api + '/api/admin/venues/delete-venue', {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: this.venueId,
        }).toPromise();

        console.log(request)

        if(request.status === 'ok') {

          this.router.navigateByUrl("/venues", {
            state: {
              venueDeleted: true
            }
          })

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not delete venue.',
            unsanitizedMessage: 'No stack trace.'
          });
        }
    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not delete venue.',
        unsanitizedMessage: error
      });

    }
  }

  public assignAdminUserToVenue(): void {
    if (this.authService.account.role === Roles.FlootAdmin) {
      this.router.navigateByUrl("/venue-admins/add-venue-admin", {
        state: {
          venueId: this.venueId
        }
      })
    } else {
      this.router.navigateByUrl("/venue-team/add-venue-team-member", {
        
        state: {
          venueId: this.venueId
        }
      })
    }
  }
  
  public navigateToEditAdminUser(id: string): void {
    this.router.navigateByUrl(`/venue-team/edit-venue-team-member/${id}`, {
      state: {
        returnUrl: `/venues/profile/${this.venueId}`
      }
    })
  }

  public async makeVenueActive(): Promise<void> {
    try {

      if (this.status !== 'hidden') {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/make-venue-active', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.status = "active";

        this.venueMarkedAsActive = true;

        setTimeout(() => {
          this.venueMarkedAsActive = false;
        }, 3000)

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
        displayMessage: "Could not make the venue active.",
        unsanitizedMessage: error
      });

    }
  }

  public async deactivateVenue(): Promise<void> {
    try {

      if (this.status === 'hidden') {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/deactivate-venue', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.status = "hidden";

        this.venueMarkedAsHidden = true;

        setTimeout(() => {
          this.venueMarkedAsHidden = false;
        }, 3000)

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
        displayMessage: "Could not deactivate the venue.",
        unsanitizedMessage: error
      });

    }
  }

  public async editContactInformation({email, phone}): Promise<void> {
    try {

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/edit-contact-information', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        email: email,
        phoneNumber: phone,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.email = email;
        this.phoneNumber = phone;

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
        displayMessage: "Could not edit the contact information.",
        unsanitizedMessage: error
      });

    }
  }

  public async saveVrmInfo({vrm, locale}: VRMFormData): Promise<void> {
    try {

      if (!(vrm && locale)) {
        return;
      }

      console.log('here');
      console.log(vrm, locale);

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/save-vrm-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        ...vrm,
        ...locale
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.vrm = {...vrm};
        this.locale = {...locale};

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
        displayMessage: "Could not edit the venue information.",
        unsanitizedMessage: error
      });

    }
  }

  public async saveOpeningTimes(openingTimes: OpeningTimes) : Promise<void> {
    try {

      if (openingTimes == null) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/save-opening-times', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        ...openingTimes
      }).toPromise();

      console.log("result: ", request)

      if(request.status === 'ok') {

        this.openingTimes = {...openingTimes};
        
        this.openingTimesUpdated = true;

        setTimeout(() => {
          this.openingTimesUpdated = false;
        }, 2000);

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
        displayMessage: "Could not edit the opening times.",
        unsanitizedMessage: error
      });

    }
  }

  public async saveExternalLink({text, url}: ExternalLink) : Promise<void> {
    try {

      if(!(text && url))
      return;

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/save-external-link', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        text: text,
        url: url
      }).toPromise();

      console.log("result: ", request)

      if(request.status === 'ok') {

        this.externalLink = {text, url};
        
        this.externalLinkUpdated = true;

        setTimeout(() => {
          this.externalLinkUpdated = false;
        }, 2000);

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
        displayMessage: "Could not edit the external link.",
        unsanitizedMessage: error
      });

    }
  }

  public async deletePost(postId: string): Promise<void> {
    try {

      if (!postId) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venue-posts/delete-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        postId: postId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        const indexOfPost = this.posts.findIndex(x => x.id === postId);

        if (indexOfPost > -1) {
          this.posts.splice(indexOfPost, 1);
        }        
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
        displayMessage: "Could not delete the post.",
        unsanitizedMessage: error
      });

    }
  }

  public async removeExternalLink() : Promise<void> {
    try {

      if (!this.externalLink) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/remove-external-link', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
      }).toPromise();

      if(request.status === 'ok') {


        this.externalLink = null;
        
        this.externalLinkUpdated = true;

        setTimeout(() => {
          this.externalLinkUpdated = false;
        }, 2000);

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
        displayMessage: "Could not remove the external link.",
        unsanitizedMessage: error
      });

    }
  }
  
  public convertStringToTime(string: string): number {
    let hours = string.split(':')[0];
    let minutes = string.split(':')[1];

    return (Number(hours) * 60) + Number(minutes);
  }

  public convertTimeToString(time: number): string {
    let hours = Math.floor(time/60);
    let minutes = (time - (hours*60));

    return `${hours < 10 ? ('0'+ hours) : hours }:${minutes < 10 ? ('0'+ minutes) : minutes }`;
  }

} 
