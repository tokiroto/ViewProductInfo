import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { BaseComponent } from './base/base.component';
import { DriveService } from './services/drive.service';

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
        DriveService
      ]
    }
  }
}
