import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 *
 *
 * @export
 * @interface ErrorEvent
 * 
 * Describes a basic error event; The display message is always
 * displayed to the user in the event. The unsanitized message is
 * only displayed in the console if the environment is set to dev.
 * 
 * The unsanitized message should contain the full stack trace that
 * is thrown.
 * 
 * Error Timestamp contains a date object from the time the error
 * was thrown for display purposes.
 * 
 */
export interface ErrorEvent {
  displayMessage: string,
  unsanitizedMessage: string,
  errorTimestamp: Date 
};

/**
 *
 *
 * @export
 * @interface NewError
 * 
 * Describes a set of params to be passed when throwing a new error.
 * 
 * The display message is always
 * displayed to the user in the event. The unsanitized message is
 * only displayed in the console if the environment is set to dev.
 * 
 * The unsanitized message should contain the full stack trace that
 * is thrown.
 * 
 */
export interface NewError {
  displayMessage: string,
  unsanitizedMessage: string,
}

/**
 *
 *
 * @export
 * @class ErrorHandlerService
 */
 @Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  public onErrorEvent = new EventEmitter<ErrorEvent>();
  constructor() { }

  /**
   *
   *
   * @param {NewError} newError
   * @memberof ErrorHandlerService
   * 
   * Throws a new error, and causes the onErrorEvent to fire.
   * 
   */
  public throwError(newError: NewError): void {
    if(newError) {

      if(!environment.production) {
        console.error(newError.unsanitizedMessage);
      }
      
      this.onErrorEvent.emit(<ErrorEvent>{
        displayMessage: newError.displayMessage,
        unsanitizedMessage: newError.unsanitizedMessage,
        errorTimestamp: new Date()
      });
    }
  }
}
