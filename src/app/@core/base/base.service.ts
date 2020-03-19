import { Injectable } from '@angular/core';
import * as Toast from 'nativescript-toast';
import { AlertOptions, alert as showAlert } from 'tns-core-modules/ui/dialogs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() { }

  /**
   * Show alert message
   * @param title - title of the alert dialog
   * @param message - message of the alert dialog
   * @param okBtnText - text for "Ok" button
   * @returns Promise<any>
   */
  showAlert(title: string, message: string, okBtnText: string = 'Ok'): Promise<any> {
    const options: AlertOptions = {
      cancelable: true,
      message: message,
      title: title,
      okButtonText: okBtnText
    };
    return showAlert(options);
  }

  /**
   * Shows toast message
   * @param message string
   * @param duration enum(long, short)
   */
  showToast(message: string, duration: 'long'|'short'): void {
    Toast.makeText(message, duration).show();
  }
}
