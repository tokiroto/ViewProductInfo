import { Component, OnInit } from '@angular/core';
import { RouterExtensions as Router } from 'nativescript-angular/router';
import * as Toast from 'nativescript-toast';
import { AlertOptions, alert as showAlert } from 'tns-core-modules/ui/dialogs';

@Component({
  selector: 'ns-base',
  template: 'Empty template',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  isLoading = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

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
  showToast(message: string, duration: 'long' | 'short'): void {
    Toast.makeText(message, duration).show();
  }
}
