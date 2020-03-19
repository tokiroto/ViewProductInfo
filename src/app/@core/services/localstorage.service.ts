import { Injectable } from '@angular/core';
import * as ApplicationSettings from 'tns-core-modules/application-settings';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  /**
   * Saves data as string on local storage
   * @param key
   * @param data 
   */
  setString(key: string, data: string): void {
    ApplicationSettings.setString(key, data);
  }

  /**
   * Gets data as string from local storage
   * @param key 
   * @returns string version of data || null
   */
  getString(key: string): string {
    return ApplicationSettings.getString(key);
  }

  /**
   * Gets parsed data from a string
   * @param key
   * @returns any || null
   */
  getObject(key: string): any {
    const rawData = ApplicationSettings.getString(key);
    return rawData ? JSON.parse(rawData) : null;
  }

  /**
   * Saves data to local storage
   * @param key 
   * @param data 
   */
  setObject(key: string, data: any): void {
    ApplicationSettings.setString(key, JSON.stringify(data));
  }
}
