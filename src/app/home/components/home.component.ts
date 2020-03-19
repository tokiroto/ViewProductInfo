import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../@core/base/base.component';
import { RouterExtensions as Router } from 'nativescript-angular/router';
import { DriveService } from '~/app/@core/services/drive.service';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent extends BaseComponent implements OnInit, AfterViewInit {

    public email: string;
    constructor(router: Router,
        private driveService: DriveService) {
        super(router);
    }

    ngOnInit(): void {
        this.email = this.driveService.authUserData.email;
    }

    ngAfterViewInit() {
        
    }

    LogOff(): void {
        this.driveService.signOut();
        this.router.navigate(['/login'], { clearHistory: true });
    }

    OpenFile(): void {
        this.driveService.openFilePicker();
    }

    /**
     * Opens route by name
     * @param routeName - route url
     */
    openPage(routeName: string): void {
        this.router.navigateByUrl(`/${routeName}`);
    }
}
