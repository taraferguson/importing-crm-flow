import { Routes } from '@angular/router';
import { OnboardingFlowComponent } from './onboarding-flow/onboarding-flow.component';

export const routes: Routes = [
  { path: '', redirectTo: '/onboarding', pathMatch: 'full' },
  { path: 'onboarding', component: OnboardingFlowComponent },
  { path: '**', redirectTo: '/onboarding' }
]; 