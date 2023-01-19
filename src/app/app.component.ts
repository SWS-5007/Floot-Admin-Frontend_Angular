import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ErrorHandlerService } from "./services/core/error-handler.service";
import { PendingSaveService } from "./services/core/pending-save.service";
import { AuthService } from "./services/identity/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Roles from "./types/roles";
import { VenueHandlerService } from "./services/identity/venue-handler.service";

export interface VenueDetails {
  id: string;
  name: string;
}
export enum TimeFrame {
  hourly,
  daily,
  weekly,
  monthly,
  yearly,
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  title = "Floot-Admin-Frontend-Application";

  public errorHasBeenThrown: boolean = false;
  public thrownError: ErrorEvent = null;

  public sidebarShouldDisplay: boolean = true;
  public pendingSaveHasBeenNotified: boolean = false;

  public accountName: string = "Loading...";
  public shouldAccountNameDisplay: boolean = true;

  public selectedVenueId: string;
  public selectedVenueName: string = "Loading...";
  public shouldDisplayVenueChoice = false;
  public accountVenues: VenueDetails[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private pendingSaveService: PendingSaveService,
    private fb: FormBuilder,
    private venueHandler: VenueHandlerService
  ) {
    this.authService.accountHasUpdated.subscribe(() => {
      this.loadAccountData();
    });

    this.initApplication();

    /**
     * Subscribe to the onErrorEvent and watch for changes.
     * This will also display the error modal to the user,
     * with data that has been passwed from the event.
     *
     */
    this.errorHandlerService.onErrorEvent.subscribe(
      (errorEvent: ErrorEvent) => {
        this.errorHasBeenThrown = true;
        this.thrownError = errorEvent;
      }
    );

    /**
     * Subscribe to the notifyPendingChanges event and watch for
     * changes. This will display the has pending changes modal
     * to the user, after unsafe navigation has been prevented
     * by the pending save service.
     *
     */
    this.pendingSaveService.notifyPendingChanges.subscribe(() => {
      this.pendingSaveHasBeenNotified = true;
    });

    //this.initApplication();

    /**
     * Subscribe to changes to the auth state and reload
     * as required.
     *
     */
    this.authService.authStateChange.subscribe(async () => {
      window.location.reload();
    });
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof AppComponent
   */
  public async initApplication(): Promise<void> {
    try {
      /**
       * Redirect the user to the authentication screens
       * if they are not already signed into the app.
       *
       */
      console.log("are we here eyetttt ");
      if (!this.authService.getAuthenticationState().isAuthenticated) {
        console.log("am i here?");
        console.log(window.location.pathname);

        if (window.location.pathname.split("/")[1] !== "authentication") {
          this.router.navigate(["/authentication/sign-in"]);
        }

        this.shouldAccountNameDisplay = false;
        this.sidebarShouldDisplay = false;
      } else {
        // ensure the account is loaded to display header account indicator.
        if (!this.authService.account) {
          await this.authService.loadAccount();

          console.log("loaded account");
        }

        if (this.authService.account.role === Roles.VenueAdmin) {
          if (!this.venueHandler.venueExists) {
            await this.venueHandler.load();
          }

          this.shouldDisplayVenueChoice =
            this.venueHandler.shouldDisplayVenueChoice;
          this.accountVenues = this.venueHandler.venues;
          this.selectedVenueId = this.venueHandler.getChosenVenueId();
          this.selectedVenueName = this.venueHandler.getChosenVenueName();

          this.venueHandler.venueEdited.subscribe(() => {
            this.shouldDisplayVenueChoice =
              this.venueHandler.shouldDisplayVenueChoice;
            this.accountVenues = this.venueHandler.venues;
            this.selectedVenueId = this.venueHandler.getChosenVenueId();
            this.selectedVenueName = this.venueHandler.getChosenVenueName();
          });
        } else {
          this.shouldDisplayVenueChoice = false;
        }

        console.log(this.router.url);

        // // redirect to default page.
        if (this.router.url === "/") {
          console.log("routing");
          console.log(this.authService.account);
          if (this.authService.account.role === Roles.VenueAdmin) {
            this.router.navigate(["/venue-profile"]);
          } else if (this.authService.account.role === Roles.SupplierAdmin) {
            this.router.navigate(["/supplier-profile"]);
          } else if (this.authService.account.role === 4) {
            this.router.navigate(["/influencer-profile"]);
          }
        }

        this.sidebarShouldDisplay = true;
        this.shouldAccountNameDisplay = true;
      }
    } catch (error) {
      this.errorHandlerService.throwError({
        displayMessage: "Application error.",
        unsanitizedMessage: "Generic stack trace error.",
      });
    }
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public clearThrownError(): void {
    this.errorHasBeenThrown = false;
    this.thrownError = null;
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public refreshBrowserTab(): void {
    window.location.reload();
  }

  public onActivate(event): void {
    if (window.innerWidth <= 767) {
      this.sidebarShouldDisplay = false;
    }

    window.scroll({
      top: 0,
      left: 0,
    });
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof AppComponent
   */
  public async navigateUnsaved(): Promise<void> {
    try {
      this.pendingSaveService.setPendingChangeState(false);
      this.pendingSaveService.navigateUnsafely();

      this.pendingSaveHasBeenNotified = false;
    } catch (error) {
      this.errorHandlerService.throwError({
        displayMessage: "Navigation error.",
        unsanitizedMessage: error as any,
      });
    }
  }

  private async loadAccountData(): Promise<void> {
    try {
      if (this.authService.getAuthenticationState().isAuthenticated) {
        if (!this.authService.account) {
          await this.authService.loadAccount();
        }

        this.accountName = this.authService.account.name;
      } else {
        this.shouldAccountNameDisplay = false;
      }
    } catch (error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not load account data",
        unsanitizedMessage: error,
      });
    }
  }

  public signOut(): void {
    this.authService.signOut();
  }

  changeSelectedVenue(venue: VenueDetails) {
    this.venueHandler.setChosenVenue(venue.id);
    this.selectedVenueId = venue.id;
    this.selectedVenueName = venue.name;
  }
}
