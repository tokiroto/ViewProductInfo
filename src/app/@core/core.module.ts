import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { BaseComponent } from './base/base.component';
import { DriveService } from './services/drive.service';
import { LocalstorageService } from './services/localstorage.service';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [BaseComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        DriveService,
        LocalstorageService,
        AuthGuard,
        AuthService
      ]
    }
  }
}
