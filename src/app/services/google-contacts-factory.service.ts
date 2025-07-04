import { Injectable } from '@angular/core';
import { GoogleContactsService } from './google-contacts.service';
import { GoogleContactsMockService } from './google-contacts-mock.service';

// Interface that both services implement
export interface IGoogleContactsService {
  isSignedIn(): boolean;
  signIn(): any;
  signOut(): any;
  getContacts(): any;
  getAuthStatus(): any;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleContactsFactoryService {
  private useMock = true; // Set to false to use real Google API

  constructor(
    private realService: GoogleContactsService,
    private mockService: GoogleContactsMockService
  ) {}

  getService(): IGoogleContactsService {
    return this.useMock ? this.mockService : this.realService;
  }

  // Method to switch between mock and real service
  setUseMock(useMock: boolean): void {
    this.useMock = useMock;
    console.log(`🔄 Switched to ${useMock ? 'mock' : 'real'} Google Contacts service`);
  }

  // Method to check current mode
  isUsingMock(): boolean {
    return this.useMock;
  }

  // Method to get the current service instance
  getCurrentService(): IGoogleContactsService {
    return this.getService();
  }
} 