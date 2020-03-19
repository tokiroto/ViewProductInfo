import { Injectable } from '@angular/core';
import { DriveService } from './drive.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private driveService: DriveService) { }

  /**
   * Checks whether the route is permit for access
   */
  isRoutePermitted(): boolean {
    return this.driveService.isUserAuthorized();
  }
}
