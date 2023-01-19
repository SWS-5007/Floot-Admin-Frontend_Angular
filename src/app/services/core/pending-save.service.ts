import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PendingSaveService {

  public hasChangesPendingSave: boolean = false;
  public notifyPendingChanges: EventEmitter<void> = new EventEmitter();

  private pendingNavigationType: "routeStack" | "routeStackWithState";
  private pendingNavigationRouteStack: Array<any> = null;
  private pendingNavigationRouteWithState = {
    navigationDestination: null as string,
    state: null as any
  }

  constructor(
    private router: Router
  ) { }

  /**
   *
   *
   * @memberof PendingSaveService
   */
  public setPendingChangeState(state: boolean): void {
    this.hasChangesPendingSave = state;
  }
    
  /**
   *
   * Init's the unsafe navigation action.
   * 
   *
   * @memberof PendingSaveService
   */
  public navigateUnsafely() {
    if(this.pendingNavigationType === 'routeStack') {
      this.proceedWithUnsafeNavigation();

    }
    else if(this.pendingNavigationType === 'routeStackWithState') {
      this.proceedWithUnsafeStatefulNavigation();

    }
    else {
      console.warn("No pending navigation stack type has been defined.");
    }
  }

  /**
   *
   * Navigates the user to the stateless navigation destination
   * and passes the cached stack to the router.
   * 
   *
   * @memberof PendingSaveService
   */
  public proceedWithUnsafeNavigation(): void {
    try {
      if(this.pendingNavigationType == "routeStack" && this.pendingNavigationRouteStack.length > 0) {
        this.router.navigate(this.pendingNavigationRouteStack);

      }
      else {
        throw "No pending navigation route stack to navigate with.";
      }
    }
    catch(error) {
      throw error;
    }
  }

  /**
   *
   * Navigates the user to a destination and passes the cached
   * state from the pendingNavigatonRoute.
   *
   * @memberof PendingSaveService
   */
   public proceedWithUnsafeStatefulNavigation(): void {
    try {
      if(this.pendingNavigationType == "routeStackWithState" && this.pendingNavigationRouteWithState) {
        this.router.navigateByUrl(this.pendingNavigationRouteWithState.navigationDestination, {
          state: this.pendingNavigationRouteWithState.state
        });

      }
      else {
        throw "No pending navigation route stack with state to navigate to.";
      }
    }
    catch(error) {
      throw error;
    }
  }

  /**
   *
   * Function used to navigate the user providing that
   * there are no pending changes to be saved. The notify
   * pendingChanges event will be called if there is to
   * display the modal.
   *
   *
   * @memberof PendingSaveService
   */
  public navigateSafely(navigationStack: Array<any>): void {
    if(this.hasChangesPendingSave) {
      this.pendingNavigationType = 'routeStack';
      this.pendingNavigationRouteStack = navigationStack;
      this.notifyPendingChanges.emit();

    }
    else {
      this.router.navigate(navigationStack);
    }
  }

  /**
   *
   * Function used to navigate the user providing that
   * there are no pending changes to be saved. The notify
   * pendingChanges event will be called if there is to
   * display the modal.
   *
   *
   * @memberof PendingSaveService
   */
   public navigateSafelyWithState(navigationDestination: string, state: any): void {
    if(this.hasChangesPendingSave) {
      this.pendingNavigationType = 'routeStackWithState';
      this.pendingNavigationRouteWithState = {
        navigationDestination: navigationDestination,
        state: state
      };

      this.notifyPendingChanges.emit();

    }
    else {
      this.router.navigateByUrl(navigationDestination, {
        state: state
      });
    }
  }
}
