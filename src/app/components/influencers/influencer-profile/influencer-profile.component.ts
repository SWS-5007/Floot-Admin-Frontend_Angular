import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import Roles from 'src/app/types/roles';
import { environment } from 'src/environments/environment';

interface BasicInfo {
  name: string,
  description: string
}

interface InfluencerAdmin {
  id: string,
  name: string,
  email: string
}

interface Tag {
  id: string,
  title: string,
  type: string
}

interface Post {
  id: string,
  caption: string,
  imageUrl: string | null,
  influencer: {
    id: string,
    name: string
  } | null,
  created: Date
}

interface ExternalLink {
  text: string,
  url: string
}

@Component({
  selector: 'app-influencer-profile',
  templateUrl: './influencer-profile.component.html',
  styleUrls: ['./influencer-profile.component.less']
})
export class InfluencerProfileComponent implements OnInit {

  public influencerId: string = null;
  public basicInfo: BasicInfo = null;
  public influencerAdmins: InfluencerAdmin[] = [];
  public status: "active" | "hidden" | "deleted" = null;

  public posts: Post[] = [];

  public tags: Tag[] = [];

  public email: string = null;
  public phoneNumber: string = null;

  public externalLink: ExternalLink = null;

  public addImageForm: FormGroup = null;
  public editDescriptionForm: FormGroup = null;
  public editTagsForm: FormGroup = null;
  public editExternalLinkForm: FormGroup = null;

  public availableTags: Tag[] = [];

  public influencerEdited: boolean = false;
  public influencerCreated: boolean = false;
  public postEdited: boolean = false;
  public postCreated: boolean = false;
  public adminAccountDeleted: boolean = false; // TODO: Frontend
  public adminAccountEdited: boolean = false; // TODO: Return URL
  public influencerMarkedAsActive: boolean = false;
  public influencerMarkedAsHidden: boolean = false;
  public openingTimesUpdated: boolean = false;
  public externalLinkUpdated: boolean = false;

  public pendingDeleteImageId: string = null;
  public pendingDeleteAdminAccountId: string = null;
  public pendingDeletePostId: string = null;

  public viewImage: string = null;

  public activePermission: boolean = false;

  get tagsInput(): FormArray {
    return this.editTagsForm.get('tags') as FormArray;
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {

    if (this.authService.account.role === Roles.FlootAdmin) {
      this.activePermission = true;
    } else {
      this.activePermission = false;
    }

    this.editTagsForm = new FormGroup({
      tags: this.fb.array([])
    })

    this.getTags();

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('influencerId')) {

        this.influencerId = paramMap.get('influencerId');

        this.loadData();

      } else {
        // go back the admin's assigned influencer
        this.influencerId = this.authService.account.assignedInfluencer;
        this.loadData();
      }
    });

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

      if(this.router.getCurrentNavigation().extras.state.influencerEdited) {
        this.influencerEdited = true

        setTimeout(() => {
          this.influencerEdited = false;
        }, 3000);
      }

      if(this.router.getCurrentNavigation().extras.state.influencerCreated) {
        this.influencerCreated = true

        setTimeout(() => {
          this.influencerCreated = false;
        }, 3000);
      }
      
    }

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


    this.editDescriptionForm = new FormGroup({
      description: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(500)
        ]
      })
    })

    this.editExternalLinkForm = new FormGroup({
      text: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      url: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    })
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/get-influencer-profile', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId ? this.influencerId : null
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.basicInfo = request.responseData.influencer.basicInfo;
        console.log("request.responseData.influencer:")
        console.log(request.responseData.influencer)
        this.editDescriptionForm.patchValue({
          description: this.basicInfo.description
        });

        this.tags = request.responseData.influencer.tags;

        this.posts = request.responseData.influencer.posts;

        this.influencerAdmins = request.responseData.influencer.admins;

        this.status = request.responseData.influencer.status;

        this.externalLink = request.responseData.influencer.externalLink;

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

  private async getTags(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/tags/get-tags', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        this.availableTags = request.responseData.tags.sort((a, b) => a.title !== b.title ? a.title < b.title ? -1 : 1 : 0);

        this.tagsInput.clear();

        for (let i = 0; i < this.availableTags.length; i++) {

          this.tagsInput.push(new FormControl(''));
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
        displayMessage: "Could not load the tags.",
        unsanitizedMessage: error
      });

    }
  }

  public async editDescription(): Promise<void> {
    try {

      if (!this.editDescriptionForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/edit-description', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId,
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

  public async editTags(): Promise<void> {
    try {

      let tags = [];

      console.log(this.editTagsForm.value.tags)

      for (let i = 0; i < this.availableTags.length; i++) {
        
        if (this.editTagsForm.value.tags[i] === true) {
          tags.push(this.availableTags[i]);
        }

      }

      console.log(tags);

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/set-tags', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId,
        tags: tags.map((tag: Tag) => { return tag.id })
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {

        this.tags = tags;
        
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

  public initEditTags(): void {

    console.log('initing')

    this.tags.forEach((tag: Tag, index: number) => {

      const availableTagIndex = this.availableTags.findIndex((x) => x.id === tag.id);

      if (availableTagIndex > -1) {

        this.tagsInput.controls[availableTagIndex].patchValue(true);

      }

    })

  }

  public navigateToEditPost(postId: string): void {

    this.router.navigateByUrl(`/posts/influencer/edit-post/${postId}`, {
      state: {
        returnUrl: `/influencers/profile/${this.influencerId}`
      }
    })

  }

  public navigateToCreatePost(): void {

    if (this.authService.account.role === Roles.FlootAdmin) {
      this.router.navigateByUrl(`/posts/influencer/create-post`, {
        state: {
          returnUrl: `/influencers/profile/${this.influencerId}`
        }
      })

    } else {
      this.router.navigateByUrl('/influencer-posts/create-post')
    }
  }

  public async deleteAdminAccount(): Promise<void> {
    try {

      const pendingDeleteUser = this.influencerAdmins.findIndex(x => x.id === this.pendingDeleteAdminAccountId);

      if (pendingDeleteUser > -1) {

        if (this.influencerAdmins[pendingDeleteUser].email === this.authService.account.email) {
          // They are trying to delete their own account
          return;
        }

        const request: any = await this.http.post(environment.api + '/api/admin/accounts/delete-account', {
          token: this.authService.getAuthenticationState().authenticationToken,
          accountId: this.pendingDeleteAdminAccountId,
        }).toPromise();

        console.log(request)

        if(request.status === 'ok' && request.responseData.userDeleted === true) {

          const userIndex = this.influencerAdmins.findIndex(x => x.id === this.pendingDeleteAdminAccountId);
          if (userIndex > -1) {
            this.influencerAdmins.splice(userIndex, 1);
          }

          this.pendingDeleteAdminAccountId = '';

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

  public async deleteInfluencer(): Promise<void> {
    try {

        const request: any = await this.http.post(environment.api + '/api/admin/influencers/delete-influencer', {
          token: this.authService.getAuthenticationState().authenticationToken,
          influencerId: this.influencerId,
        }).toPromise();

        console.log(request)

        if(request.status === 'ok') {

          this.router.navigateByUrl("/influencers", {
            state: {
              influencerDeleted: true
            }
          })

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not delete influencer.',
            unsanitizedMessage: 'No stack trace.'
          });
        }
    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not delete influencer.',
        unsanitizedMessage: error
      });

    }
  }

  public assignAdminUserToInfluencer(): void {
    if (this.authService.account.role === Roles.FlootAdmin) {
      this.router.navigateByUrl("/influencer-admins/add-influencer-admin", {
        state: {
          influencerId: this.influencerId
        }
      })
    } else {
      this.router.navigateByUrl("/influencer-team/add-influencer-team-member", {
        
        state: {
          influencerId: this.influencerId
        }
      })
    }
  }
  
  public navigateToEditAdminUser(id: string): void {
    this.router.navigateByUrl(`/influencer-admins/edit-influencer-admin/${id}`, {
      state: {
        returnUrl: `/influencers/profile/${this.influencerId}`
      }
    })
  }

  public async makeInfluencerActive(): Promise<void> {
    try {

      if (this.status !== 'hidden') {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/make-influencer-active', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.status = "active";

        this.influencerMarkedAsActive = true;

        setTimeout(() => {
          this.influencerMarkedAsActive = false;
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
        displayMessage: "Could not make the influencer active.",
        unsanitizedMessage: error
      });

    }
  }

  public async deactivateInfluencer(): Promise<void> {
    try {

      if (this.status === 'hidden') {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/deactivate-influencer', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        
        this.status = "hidden";

        this.influencerMarkedAsHidden = true;

        setTimeout(() => {
          this.influencerMarkedAsHidden = false;
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
        displayMessage: "Could not deactivate the influencer.",
        unsanitizedMessage: error
      });

    }
  }


  public async saveExternalLink() : Promise<void> {
    try {

      if (!this.editExternalLinkForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/save-external-link', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId,
        text: this.editExternalLinkForm.value.text,
        url: this.editExternalLinkForm.value.url
      }).toPromise();

      console.log("result: ", request)

      if(request.status === 'ok') {

        console.log('values: ', this.editExternalLinkForm.value)

        this.externalLink = {
          text: this.editExternalLinkForm.value.text,
          url: this.editExternalLinkForm.value.url
        }
        
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

  public async deletePost(): Promise<void> {
    try {

      if (!this.pendingDeletePostId) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/influencer-posts/delete-post', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId,
        postId: this.pendingDeletePostId
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {
        const indexOfPost = this.posts.findIndex(x => x.id === this.pendingDeletePostId);

        if (indexOfPost > -1) {
          this.posts.splice(indexOfPost, 1);
        }

        this.pendingDeletePostId = null;
        
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

      const request: any = await this.http.post(environment.api + '/api/admin/influencers/profile/remove-external-link', {
        token: this.authService.getAuthenticationState().authenticationToken,
        influencerId: this.influencerId,
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

  ngOnInit(): void {
  }

}
