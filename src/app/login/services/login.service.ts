import { Injectable, OnDestroy } from '@angular/core';
import { DriveService } from '~/app/@core/services/drive.service';
import { RouterExtensions as Router } from 'nativescript-angular/router';
import { BaseService } from '~/app/@core/base/base.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService implements OnDestroy {

  private _authEventSubscription: Subscription;
  constructor(private driveService: DriveService,
    private router: Router) {
      super();
    this._authEventSubscription = this.driveService.authEvent.subscribe((isAuthSuccess: boolean) => {
      if (isAuthSuccess) {
        this.router.navigate(['/home'], { clearHistory: true });
      } else {
        this.showToast("Something went wrong, can't authorize user", 'long');
      }
    });
  }

  ngOnDestroy(): void {
    if (this._authEventSubscription) {
      this._authEventSubscription.unsubscribe();
    }
  }

  /**
   * Logs in with user credentials into user's google profile
   */
  login(): void {
    this.driveService.signIn();
  }

  /**
   * Logs off from user's google profile
   */
  logOff(): void {
    this.driveService.signOut();
  }
}
