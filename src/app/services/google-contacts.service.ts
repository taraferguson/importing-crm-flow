import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GOOGLE_API_CONFIG } from '../config/google-api.config';

// Declare global gapi variable
declare var gapi: any;

export interface GoogleContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  scope: string;
  discoveryDocs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GoogleContactsService {
  private gapi: any;
  private auth2: any;
  private isInitialized = false;

  constructor() {
    this.loadGoogleAPI();
  }

  private loadGoogleAPI(): void {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.initializeGoogleAPI();
    };
    document.head.appendChild(script);
  }

  private initializeGoogleAPI(): void {
    if (typeof gapi !== 'undefined') {
      this.gapi = gapi;
      this.gapi.load('client:auth2', () => {
        this.gapi.client.init({
          apiKey: GOOGLE_API_CONFIG.apiKey,
          clientId: GOOGLE_API_CONFIG.clientId,
          scope: GOOGLE_API_CONFIG.scope,
          discoveryDocs: GOOGLE_API_CONFIG.discoveryDocs
        }).then(() => {
          this.auth2 = this.gapi.auth2.getAuthInstance();
          this.isInitialized = true;
          console.log('Google API initialized successfully');
        }).catch((error: any) => {
          console.error('Error initializing Google API:', error);
        });
      });
    }
  }

  public isSignedIn(): boolean {
    return this.auth2 && this.auth2.isSignedIn.get();
  }

  public signIn(): Observable<boolean> {
    if (!this.isInitialized) {
      return throwError(() => new Error('Google API not initialized'));
    }

    return from(this.auth2.signIn()).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Sign in error:', error);
        return throwError(() => new Error('Failed to sign in to Google'));
      })
    );
  }

  public signOut(): Observable<void> {
    if (!this.isInitialized) {
      return throwError(() => new Error('Google API not initialized'));
    }

    return from(this.auth2.signOut()).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error('Sign out error:', error);
        return throwError(() => new Error('Failed to sign out from Google'));
      })
    );
  }

  public getContacts(): Observable<GoogleContact[]> {
    if (!this.isInitialized) {
      return throwError(() => new Error('Google API not initialized'));
    }

    if (!this.isSignedIn()) {
      return throwError(() => new Error('User not signed in'));
    }

    return from(this.gapi.client.people.people.connections.list({
      resourceName: 'people/me',
      pageSize: 100,
      personFields: 'names,emailAddresses,phoneNumbers'
    })).pipe(
      map((response: any) => {
        const connections = response.result.connections || [];
        return connections
          .filter((person: any) => {
            // Only include contacts with names and at least email or phone
            const hasName = person.names && person.names.length > 0;
            const hasEmail = person.emailAddresses && person.emailAddresses.length > 0;
            const hasPhone = person.phoneNumbers && person.phoneNumbers.length > 0;
            return hasName && (hasEmail || hasPhone);
          })
          .map((person: any) => {
            const name = person.names[0];
            const email = person.emailAddresses && person.emailAddresses.length > 0 
              ? person.emailAddresses[0].value 
              : '';
            const phone = person.phoneNumbers && person.phoneNumbers.length > 0 
              ? person.phoneNumbers[0].value 
              : '';

            return {
              firstName: name.givenName || '',
              lastName: name.familyName || '',
              email: email,
              phone: phone
            };
          });
      }),
      catchError((error) => {
        console.error('Error fetching contacts:', error);
        return throwError(() => new Error('Failed to fetch contacts from Google'));
      })
    );
  }

  public getAuthStatus(): Observable<boolean> {
    return new Observable(observer => {
      if (this.isInitialized) {
        observer.next(this.isSignedIn());
        observer.complete();
      } else {
        // Wait for initialization
        const checkInit = setInterval(() => {
          if (this.isInitialized) {
            observer.next(this.isSignedIn());
            observer.complete();
            clearInterval(checkInit);
          }
        }, 100);
      }
    });
  }
} 