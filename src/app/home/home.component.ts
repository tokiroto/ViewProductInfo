import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../@core/base/base.component';
import { RouterExtensions as Router } from 'nativescript-angular/router';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent extends BaseComponent implements OnInit {

    constructor(router: Router) {
        super(router);
    }

    ngOnInit(): void {
        
    }

    /**
     * Opens route by name
     * @param routeName - route url
     */
    openPage(routeName: string): void {
        this.router.navigateByUrl(`/${routeName}`);
    }
}
