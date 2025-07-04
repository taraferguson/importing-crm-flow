import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="intro-container animation-slide-up">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--primary---blue--02)" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="var(--primary---blue--02)" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="var(--primary---blue--02)" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h1 class="hero-title">Populate your Speaker CRM with data from past events</h1>
        <p class="hero-subtitle">The power of the CRM: connecting events, sessions, and speakers so you have a 360° view of your speaker's lifecycle</p>
      </div>

      <!-- Value Props -->
      <div class="value-props">
        <div class="value-prop">
          <div class="value-prop-icon">🔗</div>
          <div class="value-prop-content">
            <h3>360° Speaker View</h3>
            <p>See every speaker's journey across all your events and sessions</p>
          </div>
        </div>

        <div class="value-prop">
          <div class="value-prop-icon">📊</div>
          <div class="value-prop-content">
            <h3>Historical Data Power</h3>
            <p>Import past events to build comprehensive speaker profiles</p>
          </div>
        </div>

        <div class="value-prop">
          <div class="value-prop-icon">🎯</div>
          <div class="value-prop-content">
            <h3>Lifecycle Management</h3>
            <p>Track speaker performance, preferences, and availability over time</p>
          </div>
        </div>
      </div>

      <!-- Help Resources -->
      <div class="help-resources">
        <h4>📚 Need help getting started?</h4>
        <div class="help-links">
          <a href="https://learn.sessionboard.com/en/knowledge-base/8511270-importing-data" target="_blank" class="help-link">
            📖 Read the importing guide
          </a>
          <a href="https://learn.sessionboard.com/en/knowledge-base/video-importing-data" target="_blank" class="help-link">
            🎥 Watch the video tutorial
          </a>
        </div>
        <div class="requirements-note">
          <strong>Before you start:</strong> Ensure your files are UTF-8 encoded, under 1000 records each, and in CSV/Excel format.
        </div>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <p class="cta-text">Ready to build your comprehensive speaker database?</p>
        <button class="btn btn-primary btn-large" (click)="onGetStarted()">
          Start Building Your Speaker CRM
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .intro-container {
      text-align: center;
      max-width: 100%;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .hero-section {
      margin-bottom: 20px;
      flex-shrink: 0;
    }

    .hero-icon {
      margin-bottom: 16px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }

    .hero-title {
      font-size: 1.625rem;
      font-weight: var(--font-weight-bold);
      color: var(--text---header);
      margin-bottom: 8px;
      line-height: var(--line-height-tight);
    }

    .hero-subtitle {
      font-size: 1rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      max-width: 450px;
      margin: 0 auto;
    }

    .value-props {
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
    }

    .value-prop {
      display: flex;
      align-items: flex-start;
      text-align: left;
      padding: 12px;
      background: var(--background---b-g-02);
      border-radius: var(--border-radius-lg);
      border: 1px solid var(--background---b-g-04);
      transition: all var(--transition-normal);
    }

    .value-prop:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .value-prop-icon {
      font-size: 1.5rem;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .value-prop-content h3 {
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 4px;
    }

    .value-prop-content p {
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      font-size: 0.875rem;
    }

    .help-resources {
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 16px;
      margin-bottom: 20px;
      text-align: left;
    }

    .help-resources h4 {
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 12px;
      text-align: center;
    }

    .help-links {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 12px;
    }

    .help-link {
      color: var(--primary---blue--02);
      text-decoration: none;
      font-weight: var(--font-weight-semibold);
      font-size: 0.875rem;
      padding: 8px 16px;
      border: 1px solid var(--primary---blue--02);
      border-radius: var(--border-radius-md);
      transition: all var(--transition-normal);
    }

    .help-link:hover {
      background: var(--background---b-g-03);
      transform: translateY(-1px);
    }

    .requirements-note {
      font-size: 0.75rem;
      color: var(--text---help-text);
      font-weight: var(--font-weight-light);
      text-align: center;
      padding: 8px;
      background: var(--background---b-g-01);
      border-radius: var(--border-radius-md);
    }

    .cta-section {
      margin-top: 16px;
      flex-shrink: 0;
    }

    .cta-text {
      font-size: 1rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      margin-bottom: 16px;
    }

    .btn-large {
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 1.875rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .value-prop {
        flex-direction: column;
        text-align: center;
      }

      .value-prop-icon {
        margin-right: 0;
        margin-bottom: 16px;
      }

      .help-links {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class IntroStepComponent {
  @Output() nextStep = new EventEmitter<void>();

  onGetStarted() {
    this.nextStep.emit();
  }
} 