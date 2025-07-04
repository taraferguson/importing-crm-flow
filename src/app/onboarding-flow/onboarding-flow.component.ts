import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntroStepComponent } from './steps/intro-step/intro-step.component';
import { ImportSelectionStepComponent } from './steps/import-selection-step/import-selection-step.component';
import { UploadStepComponent } from './steps/upload-step/upload-step.component';
import { OptimizationStepComponent } from './steps/optimization-step/optimization-step.component';
import { ProcessingStepComponent } from './steps/processing-step/processing-step.component';
import { SuccessStepComponent } from './steps/success-step/success-step.component';

export interface OnboardingData {
  selectedImportTypes: string[];
  uploadedFiles: { file: File, type: string }[];
  optimizations: Optimization[];
  processedData: any;
}

export interface Optimization {
  type: 'field_mapping' | 'duplicate_emails' | 'new_field' | 'speaker_connection';
  title: string;
  description: string;
  currentValue?: string;
  suggestedValue?: string;
  options?: string[];
  selectedOption?: string;
}

@Component({
  selector: 'app-onboarding-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IntroStepComponent,
    ImportSelectionStepComponent,
    UploadStepComponent,
    OptimizationStepComponent,
    ProcessingStepComponent,
    SuccessStepComponent
  ],
  template: `
    <div class="onboarding-container">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-header">
          <h2 class="flow-title">Speaker CRM Setup</h2>
          <p class="flow-subtitle">Building your comprehensive speaker database</p>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progressPercentage"></div>
        </div>
        <div class="step-indicator">
          Step {{ currentStep }} of 6: {{ getCurrentStepName() }}
        </div>
      </div>

      <!-- Step Content -->
      <div class="step-content animation-fade-in">
        <ng-container [ngSwitch]="currentStep">
          <!-- Step 1: Intro -->
          <app-intro-step 
            *ngSwitchCase="1"
            (nextStep)="nextStep()">
          </app-intro-step>

          <!-- Step 2: Import Selection -->
          <app-import-selection-step 
            *ngSwitchCase="2"
            [selectedTypes]="onboardingData.selectedImportTypes"
            (nextStep)="nextStep()"
            (importTypesSelected)="onImportTypesSelected($event)">
          </app-import-selection-step>

          <!-- Step 3: Upload -->
          <app-upload-step 
            *ngSwitchCase="3"
            [selectedTypes]="onboardingData.selectedImportTypes"
            (nextStep)="nextStep()"
            (filesUploaded)="onFilesUploaded($event)">
          </app-upload-step>

          <!-- Step 4: Optimizations -->
          <app-optimization-step 
            *ngSwitchCase="4"
            [fileAssignments]="onboardingData.uploadedFiles"
            (nextStep)="nextStep()"
            (optimizationsUpdated)="onOptimizationsUpdated($event)">
          </app-optimization-step>

          <!-- Step 5: Processing -->
          <app-processing-step 
            *ngSwitchCase="5"
            (processingComplete)="onProcessingComplete($event)">
          </app-processing-step>

          <!-- Step 6: Success -->
          <app-success-step 
            *ngSwitchCase="6"
            [processedData]="onboardingData.processedData">
          </app-success-step>
        </ng-container>
      </div>

      <!-- Navigation -->
      <div class="navigation" *ngIf="currentStep < 5">
        <button 
          class="btn btn-ghost" 
          (click)="previousStep()"
          [disabled]="currentStep === 1">
          ← Back
        </button>
        <div class="nav-help" *ngIf="currentStep < 4">
          <a href="https://learn.sessionboard.com/en/knowledge-base/8511270-importing-data" target="_blank" class="help-link">
            Need help? View guide
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-container {
      width: 100%;
      max-width: 1200px;
      background: var(--background---b-g-01);
      border-radius: var(--border-radius-xxl);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      min-height: 850px;
      max-height: 900px;
      display: flex;
      flex-direction: column;
    }

    .progress-container {
      padding: 12px 24px 8px 24px;
      background: var(--background---b-g-02);
      border-bottom: 1px solid var(--background---b-g-04);
      flex-shrink: 0;
    }

    .progress-header {
      text-align: center;
      margin-bottom: 8px;
    }

    .flow-title {
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 2px;
    }

    .flow-subtitle {
      font-size: 0.75rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      margin: 0;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--background---b-g-04);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      margin: 8px 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary---blue--02) 0%, var(--primary---blue--03) 100%);
      transition: width 0.3s ease;
      border-radius: var(--border-radius-sm);
    }

    .step-indicator {
      text-align: center;
      margin-top: 6px;
      font-size: 0.75rem;
      color: var(--text---help-text);
      font-weight: var(--font-weight-regular);
    }

    .step-content {
      padding: 16px 24px;
      flex: 1;
      overflow-y: auto;
      max-height: 750px;
    }

    .navigation {
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--background---b-g-04);
      background: var(--background---b-g-02);
      flex-shrink: 0;
    }

    .nav-help {
      display: flex;
      align-items: center;
    }

    .help-link {
      color: var(--primary---blue--02);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      padding: 6px 12px;
      border-radius: var(--border-radius-md);
      transition: all var(--transition-normal);
    }

    .help-link:hover {
      background: var(--primary---blue--01);
    }

    @media (max-width: 768px) {
      .onboarding-container {
        margin: 10px;
        border-radius: var(--border-radius-xl);
      }

      .step-content {
        padding: 24px 20px;
        min-height: 400px;
      }

      .progress-container {
        padding: 20px;
      }

      .navigation {
        padding: 16px 20px;
        flex-direction: column;
        gap: 12px;
      }

      .flow-title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class OnboardingFlowComponent implements OnInit {
  currentStep = 1;
  onboardingData: OnboardingData = {
    selectedImportTypes: [],
    uploadedFiles: [],
    optimizations: [],
    processedData: null
  };

  get progressPercentage(): number {
    return (this.currentStep / 6) * 100;
  }

  ngOnInit() {
    // Initialize with Speaker CRM-focused optimizations
    this.onboardingData.optimizations = [
      {
        type: 'speaker_connection',
        title: 'Speaker Profile Connections',
        description: 'We found 14 speakers who appear across multiple events. Connect their profiles?',
        options: ['Merge matching speakers', 'Keep separate profiles', 'Review manually'],
        selectedOption: 'Merge matching speakers'
      },
      {
        type: 'field_mapping',
        title: 'Speaker Field Mapping',
        description: 'Field "Biography" in speakers matches "Bio" in sessions',
        currentValue: 'Biography',
        suggestedValue: 'Bio'
      },
      {
        type: 'duplicate_emails',
        title: 'Duplicate Speaker Emails',
        description: 'Found speakers with duplicate emails across events - merge them?',
        options: ['Merge by email', 'Keep all versions', 'Review manually'],
        selectedOption: 'Merge by email'
      },
      {
        type: 'new_field',
        title: 'New Speaker Field',
        description: 'Sessions contain "Key Takeaway" field not in speaker profiles. Add it?',
        suggestedValue: 'Key Takeaway'
      }
    ];
  }

  getCurrentStepName(): string {
    const stepNames = [
      '', // 0 - not used
      'Welcome',
      'Select Data Types', 
      'Upload Files',
      'Optimize Connections',
      'Building Database',
      'Complete!'
    ];
    return stepNames[this.currentStep] || '';
  }

  nextStep() {
    if (this.currentStep < 6) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  skipStep() {
    this.nextStep();
  }

  onImportTypesSelected(types: string[]) {
    this.onboardingData.selectedImportTypes = types;
  }

  onFilesUploaded(files: { file: File, type: string }[]) {
    this.onboardingData.uploadedFiles = files;
  }

  onOptimizationsUpdated(optimizations: Optimization[]) {
    this.onboardingData.optimizations = optimizations;
  }

  onProcessingComplete(data: any) {
    this.onboardingData.processedData = data;
    this.nextStep(); // Automatically advance to step 6 (Success)
  }
} 