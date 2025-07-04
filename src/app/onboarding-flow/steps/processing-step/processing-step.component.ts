import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProcessingStep {
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

@Component({
  selector: 'app-processing-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="processing-container animation-slide-up">
      <div class="step-header">
        <h2>Processing your data</h2>
        <p>We're organizing and optimizing your information</p>
      </div>

      <!-- Processing Animation -->
      <div class="processing-animation">
        <div class="processing-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              stroke="#e5e7eb" 
              stroke-width="4" 
              fill="none"/>
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              stroke="url(#processingGradient)" 
              stroke-width="4" 
              fill="none"
              stroke-dasharray="339.3"
              [attr.stroke-dashoffset]="339.3 - (339.3 * overallProgress / 100)"
              transform="rotate(-90 60 60)"/>
            <defs>
              <linearGradient id="processingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea"/>
                <stop offset="100%" style="stop-color:#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="processing-text">
            <div class="progress-percentage">{{ overallProgress }}%</div>
            <div class="current-step">{{ currentStepName }}</div>
          </div>
        </div>
      </div>

      <!-- Processing Steps -->
      <div class="processing-steps">
        <div 
          *ngFor="let step of processingSteps; let i = index" 
          class="processing-step"
          [class.completed]="step.status === 'completed'"
          [class.processing]="step.status === 'processing'"
          [class.error]="step.status === 'error'">
          
          <div class="step-indicator">
            <div class="step-icon" *ngIf="step.status === 'pending'">⏳</div>
            <div class="step-icon processing" *ngIf="step.status === 'processing'">
              <div class="loading-spinner"></div>
            </div>
            <div class="step-icon completed" *ngIf="step.status === 'completed'">✓</div>
            <div class="step-icon error" *ngIf="step.status === 'error'">✗</div>
          </div>
          
          <div class="step-content">
            <h4>{{ step.name }}</h4>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Fun Facts -->
      <div class="fun-facts" *ngIf="showFunFacts">
        <div class="fun-fact">
          <div class="fun-fact-icon">🎯</div>
          <div class="fun-fact-text">
            <h4>Did you know?</h4>
            <p>{{ currentFunFact }}</p>
          </div>
        </div>
      </div>


    </div>
  `,
  styles: [`
    .processing-container {
      max-width: 100%;
      margin: 0 auto;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .step-header {
      margin-bottom: 24px;
      flex-shrink: 0;
    }

    .step-header h2 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 12px;
    }

    .step-header p {
      color: #6b7280;
      font-size: 1.125rem;
    }

    .processing-animation {
      margin-bottom: 24px;
      flex-shrink: 0;
    }

    .processing-circle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .processing-circle circle:last-child {
      transition: stroke-dashoffset 0.5s ease-in-out;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .processing-text {
      position: absolute;
      text-align: center;
    }

    .progress-percentage {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 4px;
      transition: all 0.3s ease-in-out;
    }

    .current-step {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .processing-steps {
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }

    .processing-step {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.5s ease-in-out;
      transform: translateX(0);
      opacity: 1;
      height: fit-content;
    }

    .processing-step.processing {
      background: #f0f4ff;
      border-color: #667eea;
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    .processing-step.completed {
      background: #f0fdf4;
      border-color: #10b981;
      transform: translateX(0);
    }

    .processing-step.error {
      background: #fef2f2;
      border-color: #ef4444;
      transform: translateX(0);
    }

    .step-indicator {
      flex-shrink: 0;
    }

    .step-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 1rem;
    }

    .step-icon.processing {
      background: #667eea;
      color: white;
    }

    .step-icon.completed {
      background: #10b981;
      color: white;
      animation: completePulse 0.6s ease-out;
    }

    @keyframes completePulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    .step-icon.error {
      background: #ef4444;
      color: white;
    }

    .step-content {
      flex: 1;
      text-align: left;
    }

    .step-content h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .step-content p {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .fun-facts {
      margin-bottom: 16px;
      animation: slideInUp 0.5s ease-out;
      flex-shrink: 0;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fun-fact {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .fun-fact-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .fun-fact-text h4 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 4px;
      color: #ffffff;
    }

    .fun-fact-text p {
      font-size: 0.875rem;
      opacity: 1;
      color: #ffffff;
      font-weight: 500;
    }



    @media (max-width: 768px) {
      .processing-circle svg {
        width: 100px;
        height: 100px;
      }

      .progress-percentage {
        font-size: 1.25rem;
      }

      .fun-fact {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProcessingStepComponent implements OnInit, OnDestroy {
  @Output() processingComplete = new EventEmitter<any>();

  processingSteps: ProcessingStep[] = [
    { name: 'Validating data', description: 'Checking file formats and structure', status: 'pending' },
    { name: 'Mapping fields', description: 'Matching your data to our schema', status: 'pending' },
    { name: 'Deduplicating records', description: 'Removing duplicate entries', status: 'pending' },
    { name: 'Applying optimizations', description: 'Implementing your approved changes', status: 'pending' },
    { name: 'Creating relationships', description: 'Linking related data together', status: 'pending' },
    { name: 'Finalizing import', description: 'Preparing your organized data', status: 'pending' }
  ];

  overallProgress = 0;
  currentStepName = 'Starting...';
  currentStepIndex = 0;
  showFunFacts = false;


  funFacts = [
    'The average CRM user saves 5 hours per week with automated data organization!',
    'Companies using organized CRM data see 25% higher conversion rates.',
    'Clean data can improve email deliverability by up to 40%.',
    'Organized contact records help teams respond 3x faster to inquiries.',
    'Data quality directly impacts customer satisfaction scores.'
  ];

  currentFunFact = '';
  funFactIndex = 0;



  private intervalId: ReturnType<typeof setInterval> | undefined;
  private funFactInterval: ReturnType<typeof setInterval> | undefined;


  ngOnInit() {
    this.startProcessing();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.funFactInterval) clearInterval(this.funFactInterval);
  }

  private startProcessing() {
    this.intervalId = setInterval(() => {
      this.processNextStep();
    }, 2000);

    // Show fun facts after 3 seconds
    setTimeout(() => {
      this.showFunFacts = true;
      this.currentFunFact = this.funFacts[0];
      this.startFunFacts();
    }, 3000);


  }

  private processNextStep() {
    if (this.currentStepIndex < this.processingSteps.length) {
      // Complete current step
      if (this.currentStepIndex > 0) {
        this.processingSteps[this.currentStepIndex - 1].status = 'completed';
      }

      // Start next step
      this.processingSteps[this.currentStepIndex].status = 'processing';
      this.currentStepName = this.processingSteps[this.currentStepIndex].name;
      
      this.currentStepIndex++;
      this.overallProgress = Math.round((this.currentStepIndex / this.processingSteps.length) * 100);

      // Simulate processing time
      setTimeout(() => {
        if (this.currentStepIndex <= this.processingSteps.length) {
          this.processingSteps[this.currentStepIndex - 1].status = 'completed';
        }
      }, 1500);

    } else {
      // Processing complete
      clearInterval(this.intervalId);
      this.overallProgress = 100;
      this.currentStepName = 'Complete!';
      
      setTimeout(() => {
        this.processingComplete.emit({
          totalRecords: 1247,
          events: 23,
          sessions: 156,
          speakers: 89,
          optimizations: 3
        });
      }, 2000);
    }
  }

  private startFunFacts() {
    this.funFactInterval = setInterval(() => {
      this.funFactIndex = (this.funFactIndex + 1) % this.funFacts.length;
      this.currentFunFact = this.funFacts[this.funFactIndex];
    }, 8000);
  }


} 