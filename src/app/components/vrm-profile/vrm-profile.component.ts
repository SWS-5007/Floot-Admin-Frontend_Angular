import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ErrorHandlerService } from "src/app/services/core/error-handler.service";
import { AuthService } from "src/app/services/identity/auth.service";
import { environment } from 'src/environments/environment';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { Router } from '@angular/router';
import { VrmVisitTimingsData } from "src/app/containers/vrm-visit-time-container/vrm-visit-time-container.component";
import { VrmTechData } from "src/app/containers/vrm-technology-container/vrm-technology-container.component";
import { VRMFormData } from "src/app/modals/update-vrm-info-modal/update-vrm-info-modal.component";
import { Locale, Vrm } from "../venues/venue-profile/venue-profile.component";
import { ActivityFormData } from "src/app/modals/activity-log-modal/activity-log-modal.component";
import { ActivityLog } from "src/app/containers/activity-log-container/activity-log-container.component";

export interface VrmRatings {
  activationOpenness: number | null,
  repVisitFreq: number | null,
  staffEnterCocktailComps: number | null,
  firstVisitSale: number | null,
  trust: number | null,
  vrmVenueRelationship: number | null,
  cooperation: number | null,
  flootInteraction: number | null
}

@Component({
  selector: "app-vrm-profile",
  templateUrl: "./vrm-profile.component.html",
  styleUrls: ["./vrm-profile.component.less"],
})
export class VrmProfileComponent implements OnInit {
  venueId: string;
  venueName: string;

  vrmBasicInfo: Vrm;
  vrmLocale: Locale;
  vrmRatings: VrmRatings = null;
  vrmVisitInfo: VrmVisitTimingsData = null;
  vrmTechInfo: VrmTechData = null;

  vrmRatingsUpdated: boolean = false;
  vrmVisitInfoUpdated: boolean = false;
  vrmTechInfoUpdated: boolean = false;
  activityLogs:ActivityLog[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initComponent();
  }

  initComponent() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has("venueId")) {
        this.venueId = paramMap.get("venueId");
        this.loadData();
      }
    });
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/venues/vrm-profile/get-venue-vrm', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId ? this.venueId : null
      }).toPromise();

      console.log(request)

      if(request.status === 'ok') {  
        const {venueName, ratings, visitInfo, techInfo, basicInfo, locale, activityLogs} = request.responseData;
        this.venueName = venueName;
        this.vrmRatings = {...ratings};
        this.vrmVisitInfo = {...visitInfo};
        this.vrmTechInfo = {...techInfo};
        this.vrmBasicInfo = {...basicInfo};
        this.vrmLocale = {...locale};
        this.activityLogs = [...activityLogs] ?? [];

        console.log('techinfo res');
        console.log(request.responseData);

        /** 
         * 
         * TODO: Replace below lines with actual data..
        
        this.vrmVisitInfo = {
          appointmentNeeded: "",
          timeToVisit:{
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          },
          adminDay: ["monday", "sunday"],
          orderDay: [],
          deliveryDay: [],
          painPoints: "",
        }
        this.vrmTechInfo = {
          eposTill: '',
          instaHandle: '',
          integration: ''
        }*/
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

  public async saveVrmRatings(vrmRatings: VrmRatings) : Promise<void> {

    console.log('hit saveRatings')

    try {

      if (vrmRatings == null) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/vrm-profile/save-venue-ratings', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        ...vrmRatings
      }).toPromise();

      console.log("result: ", request)

      if(request.status === 'ok') {

        this.vrmRatings = {...vrmRatings};
        this.vrmRatingsUpdated = true;

        setTimeout(() => {
          this.vrmRatingsUpdated = false;
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
        displayMessage: "Could not edit the ratings.",
        unsanitizedMessage: error
      });

    }
  }

  public async saveVrmVisitInfo(visitInfo: VrmVisitTimingsData): Promise<void> {

    console.log('hit saveVrmVisitInfo')

    try {

      if (visitInfo == null) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/vrm-profile/save-visit-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        ...visitInfo
      }).toPromise();

      console.log("result: ", request)

      if(request.status === 'ok') {

        this.vrmVisitInfo = {...visitInfo};
        this.vrmVisitInfoUpdated = true;

        setTimeout(() => {
          this.vrmVisitInfoUpdated = false;
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
        displayMessage: "Could not edit the visit info.",
        unsanitizedMessage: error
      });

    }


  }

  public async saveVrmTech(vrmTech: VrmTechData): Promise<void>{

    console.log('hit saveVrmTechInfo')

    try {

      if (vrmTech == null) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/venues/vrm-profile/save-tech-info', {
        token: this.authService.getAuthenticationState().authenticationToken,
        venueId: this.venueId,
        ...vrmTech
      }).toPromise();

      console.log("result: ", request)

      if(request.status === 'ok') {

        this.vrmTechInfo = {...vrmTech};
        this.vrmTechInfoUpdated = true;

        setTimeout(() => {
          this.vrmTechInfoUpdated = false;
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
        displayMessage: "Could not edit the tech info.",
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
        
        this.vrmBasicInfo = {...vrm};
        this.vrmLocale = {...locale};

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

  public async saveActivity({activityType, comment, activityDate}: ActivityFormData): Promise<void>{
    if(!activityType || !comment){
      return;
    }
    try{
    const request: any = await this.http.post(environment.api + '/api/admin/activity-logs/save-activity-log', {
      token: this.authService.getAuthenticationState().authenticationToken,
      venueId: this.venueId,
      activityType,
      activityDate: new Date(activityDate).toISOString(),
      comment,
    }).toPromise();
    if(request.status === 'ok') {
      const addedActivity = request.responseData;
      this.activityLogs = [...this.activityLogs, addedActivity];
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

  navigateToVenueDetails(){
    this.router.navigateByUrl(`/venues/profile/${this.venueId}`, {
      state: {
        returnUrl: `/venues/vrm-details/${this.venueId}`
      }
    })
  }
  ngOnInit(): void {}
}
