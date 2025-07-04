import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface GoogleContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleContactsMockService {
  private signedIn = false;
  private mockContacts: GoogleContact[] = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0123'
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0124'
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      phone: '+1-555-0125'
    },
    {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phone: '+1-555-0126'
    },
    {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      phone: '+1-555-0127'
    },
    {
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@example.com',
      phone: '+1-555-0128'
    },
    {
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@example.com',
      phone: '+1-555-0129'
    },
    {
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jennifer.martinez@example.com',
      phone: '+1-555-0130'
    },
    {
      firstName: 'Christopher',
      lastName: 'Garcia',
      email: 'christopher.garcia@example.com',
      phone: '+1-555-0131'
    },
    {
      firstName: 'Amanda',
      lastName: 'Rodriguez',
      email: 'amanda.rodriguez@example.com',
      phone: '+1-555-0132'
    },
    {
      firstName: 'James',
      lastName: 'Miller',
      email: 'james.miller@example.com',
      phone: '+1-555-0133'
    },
    {
      firstName: 'Jessica',
      lastName: 'Moore',
      email: 'jessica.moore@example.com',
      phone: '+1-555-0134'
    },
    {
      firstName: 'Daniel',
      lastName: 'Jackson',
      email: 'daniel.jackson@example.com',
      phone: '+1-555-0135'
    },
    {
      firstName: 'Ashley',
      lastName: 'Martin',
      email: 'ashley.martin@example.com',
      phone: '+1-555-0136'
    },
    {
      firstName: 'Matthew',
      lastName: 'Lee',
      email: 'matthew.lee@example.com',
      phone: '+1-555-0137'
    }
  ];

  public isSignedIn(): boolean {
    return this.signedIn;
  }

  public signIn(): Observable<boolean> {
    console.log('🔐 Mock: Signing in to Google...');
    
    // Simulate network delay
    return of(true).pipe(
      delay(1500)
    ).pipe(
      delay(0), // Ensure async behavior
      () => {
        this.signedIn = true;
        console.log('✅ Mock: Successfully signed in to Google');
        return of(true);
      }
    );
  }

  public signOut(): Observable<void> {
    console.log('🔐 Mock: Signing out from Google...');
    
    return of(undefined).pipe(
      delay(500)
    ).pipe(
      delay(0), // Ensure async behavior
      () => {
        this.signedIn = false;
        console.log('✅ Mock: Successfully signed out from Google');
        return of(undefined);
      }
    );
  }

  public getContacts(): Observable<GoogleContact[]> {
    if (!this.isSignedIn()) {
      console.log('❌ Mock: User not signed in');
      return throwError(() => new Error('User not signed in'));
    }

    console.log('📱 Mock: Fetching contacts from Google...');
    
    // Simulate API call delay and potential network issues
    return of([...this.mockContacts]).pipe(
      delay(2000 + Math.random() * 1000) // 2-3 second delay
    ).pipe(
      delay(0), // Ensure async behavior
      () => {
        console.log(`✅ Mock: Successfully fetched ${this.mockContacts.length} contacts`);
        return of([...this.mockContacts]);
      }
    );
  }

  public getAuthStatus(): Observable<boolean> {
    return of(this.signedIn).pipe(delay(100));
  }

  // Method to simulate different scenarios
  public simulateError(errorType: 'network' | 'auth' | 'no_contacts' = 'network'): void {
    switch (errorType) {
      case 'network':
        console.log('🌐 Mock: Simulating network error');
        break;
      case 'auth':
        console.log('🔐 Mock: Simulating authentication error');
        this.signedIn = false;
        break;
      case 'no_contacts':
        console.log('📱 Mock: Simulating no contacts found');
        this.mockContacts = [];
        break;
    }
  }

  // Method to reset mock state
  public reset(): void {
    this.signedIn = false;
    // Reset contacts to original list
    this.mockContacts = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0124'
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        phone: '+1-555-0125'
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com',
        phone: '+1-555-0126'
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@example.com',
        phone: '+1-555-0127'
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.anderson@example.com',
        phone: '+1-555-0128'
      },
      {
        firstName: 'Robert',
        lastName: 'Taylor',
        email: 'robert.taylor@example.com',
        phone: '+1-555-0129'
      },
      {
        firstName: 'Jennifer',
        lastName: 'Martinez',
        email: 'jennifer.martinez@example.com',
        phone: '+1-555-0130'
      },
      {
        firstName: 'Christopher',
        lastName: 'Garcia',
        email: 'christopher.garcia@example.com',
        phone: '+1-555-0131'
      },
      {
        firstName: 'Amanda',
        lastName: 'Rodriguez',
        email: 'amanda.rodriguez@example.com',
        phone: '+1-555-0132'
      },
      {
        firstName: 'James',
        lastName: 'Miller',
        email: 'james.miller@example.com',
        phone: '+1-555-0133'
      },
      {
        firstName: 'Jessica',
        lastName: 'Moore',
        email: 'jessica.moore@example.com',
        phone: '+1-555-0134'
      },
      {
        firstName: 'Daniel',
        lastName: 'Jackson',
        email: 'daniel.jackson@example.com',
        phone: '+1-555-0135'
      },
      {
        firstName: 'Ashley',
        lastName: 'Martin',
        email: 'ashley.martin@example.com',
        phone: '+1-555-0136'
      },
      {
        firstName: 'Matthew',
        lastName: 'Lee',
        email: 'matthew.lee@example.com',
        phone: '+1-555-0137'
      }
    ];
  }
} 