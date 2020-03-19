import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import * as App from 'tns-core-modules/application';
import { UserData } from '../models/user.model';
import { BaseService } from '../base/base.service';
import { LocalstorageService } from './localstorage.service';
import * as utilsModule from 'tns-core-modules/utils/utils';

declare var com;
declare var java;
declare var android;

@Injectable({
  providedIn: 'root'
})
export class DriveService extends BaseService implements OnDestroy {

  private _authEvent: EventEmitter<boolean>;
  private readonly _REQUEST_CODE_SIGN_IN = 100;
  private readonly _REQUEST_CODE_OPEN_DOCUMENT = 101;
  private readonly _USER_KEY = 'USER_DATA';
  private _mGoogleSignInClient;
  private _mDriveServiceHelper;
  private _authUserData: UserData;

  constructor(private localStorage: LocalstorageService) {
    super();
    this._authEvent = new EventEmitter();
    this._authUserData = this.localStorage.getObject(this._USER_KEY);
    // Listen for activity result event
    App.android.on(App.AndroidApplication.activityResultEvent, (args: App.AndroidActivityResultEventData) => {
      switch (args.requestCode) {
        case this._REQUEST_CODE_SIGN_IN:
          if (args.resultCode == android.app.Activity.RESULT_OK && args.intent != null) {
            this._handleSignInResult(args.intent);
          }
          break;

        case this._REQUEST_CODE_OPEN_DOCUMENT:
          if (args.resultCode == android.app.Activity.RESULT_OK && args.intent != null) {
            let uri = args.intent.getData();
            if (uri != null) {
              this._openFileFromFilePicker(uri);
            }
          }
          break;
      }
    });
    const signin = com.google.android.gms.auth.api.signin;
    const Builder = signin.GoogleSignInOptions.Builder;
    const Scope = com.google.android.gms.common.api.Scope;
    const DriveScopes = com.google.api.services.drive.DriveScopes;
    const googleSignIn = signin.GoogleSignIn;
    try {
      let signInOptions = new Builder(signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestEmail()
        .requestScopes(new Scope(DriveScopes.DRIVE_FILE), [])
        .build();
      this._mGoogleSignInClient = googleSignIn.getClient(App.android.context, signInOptions);
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    App.android.off(App.AndroidApplication.activityResultEvent);
  }

  get authEvent(): EventEmitter<boolean> {
    return this._authEvent;
  }

  get authUserData(): UserData {
    return this._authUserData;
  }

  /**
   * Checks whether user has logged in
   * @returns boolean
   */
  isUserAuthorized(): boolean {
    const userData = this.localStorage.getObject(this._USER_KEY);
    return !!userData;
  }

  /**
   * Calls sign in process with OAuth2
   */
  signIn(): void {
    try {
      const activity = App.android.foregroundActivity || App.android.startActivity;
      activity.startActivityForResult(this._mGoogleSignInClient.getSignInIntent(), this._REQUEST_CODE_SIGN_IN);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Calls sign out process
   */
  signOut(): void {
    this._mGoogleSignInClient.signOut();
    this.localStorage.setObject(this._USER_KEY, null);
  }

  /**
    * Opens the Storage Access Framework file picker using
    */
  openFilePicker(): void {
    if (this._mDriveServiceHelper != null) {
      const allowedMimeTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.google-apps.spreadsheet"];
      let pickerIntent = this._mDriveServiceHelper.createFilePickerIntent(allowedMimeTypes);
      const activity = App.android.foregroundActivity || App.android.startActivity;
      activity.startActivityForResult(pickerIntent, this._REQUEST_CODE_OPEN_DOCUMENT);
    }
  }

  /**
   * Opens a file from its {@code uri} returned from the Storage Access Framework file picker
   * initiated by {@link #openFilePicker()}.
   */
  private _openFileFromFilePicker(uri): void {
    var parent = this;
    if (this._mDriveServiceHelper != null) {
      this._mDriveServiceHelper.openFileUsingStorageAccessFramework(App.android.context.getContentResolver(), uri)
        .addOnSuccessListener(new com.google.android.gms.tasks.OnSuccessListener({
          onSuccess: function (nameAndContent) {
            let name = nameAndContent.first;
            let content = nameAndContent.second;
            parent.showAlert('Info', `Gotten file:  ${name}, ${content}`);
          }
        }))
        .addOnFailureListener(new com.google.android.gms.tasks.OnFailureListener({
          onFailure: function (exception) {
            parent.showAlert('Error', `Unable to open file from picker. ${exception}`);
          }
        }));
    }
  }

  /**
   * Result handler of Sign In Activity
   * @param result Android.Intent
   */
  private _handleSignInResult(result): void {
    const signin = com.google.android.gms.auth.api.signin;
    const GoogleSignIn = signin.GoogleSignIn;
    const Drive = com.google.api.services.drive;
    const DriveScopes = Drive.DriveScopes;
    try {
      var parent = this;
      GoogleSignIn.getSignedInAccountFromIntent(result)
        .addOnSuccessListener(new com.google.android.gms.tasks.OnSuccessListener({
          onSuccess: function (googleAccount) {
            parent._mDriveServiceHelper = parent._onSignSuccessListener.call(App.android.context, googleAccount);
            const userData: UserData = {
              email: googleAccount.getEmail(),
              grantedScopes: googleAccount.getGrantedScopes(),
              id: googleAccount.getId(),
              photoUrl: googleAccount.getPhotoUrl,
              requestedScopes: googleAccount.getRequestedScopes(),
              serverAuthCode: googleAccount.getServerAuthCode(),
              tokenId: googleAccount.getIdToken()
            };
            parent._authUserData = userData;
            parent.localStorage.setObject(parent._USER_KEY, userData);
            parent._authEvent.emit(true);
          }
        }))
        .addOnFailureListener(new com.google.android.gms.tasks.OnFailureListener({
          onFailure: function (exception) {
            parent.localStorage.setObject(parent._USER_KEY, null);
            parent._onSignFailureListener.call(this, exception);
            parent._authEvent.emit(false);
          }
        }));
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * On Sign In Success callback
   * @param googleAccount
   */
  private _onSignSuccessListener(googleAccount: any): any {
    const drive = com.google.api.services.drive;
    const DriveScopes = drive.DriveScopes;
    const GoogleAccountCredential = com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
    // Use the authenticated account to sign in to the Drive service.
    const credential = GoogleAccountCredential.usingOAuth2(this, java.util.Collections.singleton(DriveScopes.DRIVE_FILE));
    credential.setSelectedAccount(googleAccount.getAccount());
    let googleDriveService = new drive.Drive.Builder(
      com.google.api.client.extensions.android.http.AndroidHttp.newCompatibleTransport(),
      new com.google.api.client.json.gson.GsonFactory(),
      credential)
      .setApplicationName("ViewProductInfo")
      .build();
    return new com.google.android.gms.drive.driveapimigration.DriveServiceHelper(googleDriveService);
  }

  /**
   * On Sign In Failure callback
   * @param exception 
   */
  private _onSignFailureListener(exception): void {
    console.log("Unable to sign in.", exception);
  }
}
