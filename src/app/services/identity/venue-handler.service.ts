import { Injectable, EventEmitter } from '@angular/core';
import { VenueDetails } from 'src/app/app.component';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import Roles from 'src/app/types/roles';

// VenueHandler Service
/* Created to manage venue admin accounts
* It loads all admin's venues basic information 
* Keeps track of which venue the current user is observing 
* Alerts other components when the admin changes the venue theyre observing 
*/ 

@Injectable({
  providedIn: 'root'
})
export class VenueHandlerService {

  public venueChange = new EventEmitter();
  public venueLoaded = new EventEmitter();
  public venueEdited = new EventEmitter();
  public venueExists: boolean = false;
  
  shouldDisplayVenueChoice: boolean = false;
  chosenVenue: VenueDetails = null;
  venues: VenueDetails[] = [];
  role: Roles = null;
  
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  public async load() {
    if(!this.authService.account) {
      await this.authService.loadAccount();
    }
    await this.getVenueDetails();
    this.chosenVenue = {
      id: this.venues[0].id,
      name: this.venues[0].name
    }
    this.shouldDisplayVenueChoice = (this.venues.length > 1)
    this.venueExists = true;
    this.venueLoaded.emit();
    console.log("Chosen Venue: " + this.chosenVenue);
  }

  public setVenueDetails(venue: VenueDetails) {
    if(venue) {
      this.chosenVenue = venue;
    }
  }

  public getChosenVenue() {
    return this.chosenVenue;
  }

  public getChosenVenueName() {
    return this.chosenVenue.name;
  }

  public getChosenVenueId() {
    return this.chosenVenue.id;
  }

  public getVenueName(venueId): string {
    for(let i=0; i<this.venues.length; i++) {
      if(this.venues[i].id === venueId) {
        return this.venues[i].name;
      }
    }
  }

  public setChosenVenue(venueId) {
    this.chosenVenue = {
      id: venueId,
      name: this.getVenueName(venueId)
    }
    this.venueChange.emit();
  }

  public async getVenueDetails(): Promise<void> {
    this.venues = [];
    if(this.authService.getAuthenticationState().isAuthenticated) {
      for(let i=0; i<this.authService.account.assignedVenue.length; i++) {
        try{
          const request: any = await this.http.post(environment.api + '/api/admin/venues/profile/get-venue-basic-info', {
            token: this.authService.getAuthenticationState().authenticationToken,
            venueId: this.authService.account.assignedVenue[i]
          }).toPromise();
          if(request.status === 'ok') {
            this.venues.push({
              id: this.authService.account.assignedVenue[i],
              name: request.responseData.venue.name
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
            displayMessage: "Could not load the venue.",
            unsanitizedMessage: error
          });
        }
      }
    }
  }
}
