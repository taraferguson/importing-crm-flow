import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleContactsMockService, GoogleContact } from '../../../services/google-contacts-mock.service';

@Component({
  selector: 'app-success-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container animation-fade-in">
      <!-- Success Header -->
      <div class="success-header">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="var(--success--success5)" stroke-width="2" fill="var(--success--success1)"/>
            <path d="M8 12L11 15L16 9" stroke="var(--success--success7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h1 class="success-title">Your Speaker CRM is ready!</h1>
        <p class="success-subtitle">You now have a 360° view of your speaker ecosystem</p>
      </div>

      <div class="success-content">
        <!-- Import Summary -->
        <div class="import-summary">
          <h3>🎉 Successfully Imported:</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-icon">📅</div>
              <div class="summary-content">
                <div class="summary-count">{{ getSummaryCount('events') }}</div>
                <div class="summary-label">Past Events</div>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">🎤</div>
              <div class="summary-content">
                <div class="summary-count">{{ getSummaryCount('speakers') }}</div>
                <div class="summary-label">Speaker Profiles</div>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">💼</div>
              <div class="summary-content">
                <div class="summary-count">{{ getSummaryCount('sessions') }}</div>
                <div class="summary-label">Speaking Sessions</div>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">👥</div>
              <div class="summary-content">
                <div class="summary-count">{{ getSummaryCount('users') }}</div>
                <div class="summary-label">Team Members</div>
              </div>
            </div>
          </div>
          
          <div class="connection-status">
            <div class="connection-success">
              🔗 Data Successfully Connected
            </div>
          </div>
        </div>

        <!-- Speaker CRM Features -->
        <div class="crm-features">
          <h3>🚀 Now you can:</h3>
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div class="feature-text">Track speaker performance across multiple events</div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div class="feature-text">Build speaker recommendations for future events</div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📅</div>
              <div class="feature-text">Monitor speaker availability and preferences</div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📈</div>
              <div class="feature-text">Generate comprehensive speaker reports and insights</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps">
        <h3>📝 Recommended Next Steps:</h3>
        <div class="steps-grid">
          <button class="step-card" (click)="onGetStarted()">
            <div class="step-icon">🎤</div>
            <h4>Explore Speaker Profiles</h4>
            <p>View comprehensive speaker history</p>
          </button>
          
          <button class="step-card" [disabled]="isImporting" (click)="importFromGoogleContacts()">
            <div class="step-icon">📧</div>
            <h4>{{ isImporting ? 'Importing...' : 'Import More Contacts' }}</h4>
            <p>Add additional speakers</p>
          </button>
          
          <button class="step-card">
            <div class="step-icon">⚙️</div>
            <h4>Configure Settings</h4>
            <p>Set up event portals</p>
          </button>
          
          <button class="step-card">
            <div class="step-icon">📋</div>
            <h4>Plan Next Event</h4>
            <p>Use your speaker data</p>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      text-align: center;
      max-width: 100%;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .success-header {
      margin-bottom: 24px;
      flex-shrink: 0;
    }

    .success-icon {
      margin-bottom: 24px;
      animation: scaleIn 0.5s ease-out;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .success-title {
      font-size: 2.25rem;
      font-weight: var(--font-weight-bold);
      color: var(--text---header);
      margin-bottom: 12px;
      line-height: var(--line-height-tight);
    }

    .success-subtitle {
      font-size: 1.25rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }

    .success-content {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      overflow-y: auto;
    }

    .import-summary {
      background: var(--success--success0);
      border: 1px solid var(--success--success3);
      border-radius: var(--border-radius-lg);
      padding: 20px;
    }

    .import-summary h3 {
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      color: var(--success--success8);
      margin-bottom: 20px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .summary-item {
      background: var(--background---b-g-01);
      border-radius: var(--border-radius-lg);
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .summary-icon {
      font-size: 1.5rem;
    }

    .summary-count {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--success--success7);
    }

    .summary-label {
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---body-text);
      text-align: center;
    }

    .connection-status {
      text-align: center;
    }

    .connection-success {
      background: var(--success--success1);
      border: 1px solid var(--success--success4);
      border-radius: var(--border-radius-md);
      padding: 8px 12px;
      font-size: 0.875rem;
      color: var(--success--success8);
      display: inline-block;
      font-weight: var(--font-weight-semibold);
    }

    .crm-features {
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 20px;
      text-align: left;
    }

    .crm-features h3 {
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 12px;
      text-align: center;
    }

    .feature-list {
      display: grid;
      gap: 8px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--background---b-g-01);
      border-radius: var(--border-radius-md);
    }

    .feature-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .feature-text {
      font-size: 0.875rem;
      font-weight: var(--font-weight-regular);
      color: var(--text---body-text);
    }

    .next-steps {
      flex-shrink: 0;
    }

    .next-steps h3 {
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 12px;
      text-align: center;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .step-card {
      background: var(--background---b-g-01);
      border: 2px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-normal);
      min-height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }

    .step-card:hover:not(:disabled) {
      border-color: var(--primary---blue--02);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .step-card:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .step-icon {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    .step-card h4 {
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 4px;
    }

    .step-card p {
      font-size: 0.875rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      margin: 0;
    }



    @media (max-width: 768px) {
      .success-title {
        font-size: 1.875rem;
      }

      .success-subtitle {
        font-size: 1.125rem;
      }

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .steps-grid {
        grid-template-columns: 1fr;
      }

      .help-links {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class SuccessStepComponent {
  @Input() processedData: any;
  isImporting = false;

  constructor(private googleContactsService: GoogleContactsMockService) {}

  getSummaryCount(dataType: string): number {
    // Mock data for demonstration
    const counts: { [key: string]: number } = {
      'events': 12,
      'speakers': 47,
      'sessions': 89,
      'users': 8
    };
    return counts[dataType] || 0;
  }

  onGetStarted() {
    // Navigate to speaker profiles or main application
    // In a real implementation, this would navigate to the main CRM dashboard
    window.location.href = '/dashboard'; // Example navigation
  }

  async importFromGoogleContacts() {
    this.isImporting = true;
    try {
      const contacts = await this.googleContactsService.getContacts();
      // Handle imported contacts - could add them to speaker profiles
      // In a real implementation, this would integrate with the backend
    } catch (error) {
      // Handle error gracefully - could show user notification
      console.error('Error importing contacts:', error);
    } finally {
      this.isImporting = false;
    }
  }
} 