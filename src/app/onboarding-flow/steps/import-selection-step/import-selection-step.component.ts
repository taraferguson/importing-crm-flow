import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { importOptions, ImportType } from '../../../config/import-types.config';

@Component({
  selector: 'app-import-selection-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="import-selection-container animation-slide-up">
      <div class="step-header">
        <h2>What historical data do you want to import to build speaker profiles?</h2>
        <p>Select data types to create your 360° speaker view. The more historical data you import, the richer your speaker profiles become.</p>
      </div>

      <div class="data-relationship-note">
        <div class="relationship-flow">
          <span class="flow-item">📅 Past Events</span>
          <span class="flow-arrow">→</span>
                          <span class="flow-item">💼 Sessions and Webinars</span>
          <span class="flow-arrow">→</span>
          <span class="flow-item">🎤 Speaker Profiles</span>
          <span class="flow-arrow">→</span>
          <span class="flow-item">👥 Team Members</span>
        </div>
        <p class="relationship-text">Each data type connects to build your comprehensive speaker lifecycle view</p>
      </div>

      <div class="import-options">
        <div 
          *ngFor="let option of importOptions" 
          class="import-option"
          [class.selected]="selectedTypes.includes(option.id)"
          (click)="toggleSelection(option.id)">
          
          <div class="option-header">
            <div class="option-icon">{{ option.icon }}</div>
            <div class="option-info">
              <h3>{{ option.name }}</h3>
              <p>{{ option.description }}</p>
            </div>
            <div class="checkbox">
              <div class="checkbox-inner" [class.checked]="selectedTypes.includes(option.id)"></div>
            </div>
          </div>

          <!-- Template Preview -->
          <div class="template-preview" *ngIf="selectedTypes.includes(option.id)">
            <div class="template-header">
              <h4>📋 Sessionboard Template</h4>
              <button class="btn btn-primary btn-sm" (click)="downloadTemplate(option); $event.stopPropagation()">
                📥 Download Template First
              </button>
            </div>
            
            <div class="template-note">
              <strong>Recommended:</strong> Download the template first to ensure your data matches Sessionboard's format requirements.
            </div>
            
            <div class="template-fields">
              <div class="field-group">
                <h5>Required Fields</h5>
                <div class="field-list">
                  <span 
                    *ngFor="let field of option.template.mandatory" 
                    class="field-tag mandatory">
                    {{ field }}
                  </span>
                </div>
              </div>
              
              <div class="field-group">
                <h5>Optional Fields</h5>
                <div class="field-list">
                  <span 
                    *ngFor="let field of option.template.optional" 
                    class="field-tag optional">
                    {{ field }}
                  </span>
                </div>
              </div>
            </div>

            <div class="format-requirements" *ngIf="option.id === 'sessions'">
              <h5>⚠️ Format Requirements for Sessions</h5>
              <ul>
                <li>Dates: DD/MM/YYYY HH:MM format</li>
                <li>Speaker ID: Must match speakers you're importing</li>
                <li>Event ID: Must match events you're importing</li>
              </ul>
            </div>

            <div class="format-requirements" *ngIf="option.id === 'speakers'">
              <h5>⚠️ Format Requirements for Speakers</h5>
              <ul>
                <li>Phone: +1 (123)456-7891 format</li>
                <li>URLs: https://website.com format</li>
                <li>Multi-select fields: separated by pipes (|)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <button 
          class="btn btn-primary" 
          [disabled]="selectedTypes.length === 0"
          (click)="onContinue()">
          Continue with {{ selectedTypes.length }} data type{{ selectedTypes.length !== 1 ? 's' : '' }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .import-selection-container {
      max-width: 100%;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .step-header {
      text-align: center;
      margin-bottom: 20px;
      flex-shrink: 0;
    }

    .step-header h2 {
      font-size: 1.875rem;
      font-weight: var(--font-weight-bold);
      color: var(--text---header);
      margin-bottom: 12px;
      line-height: var(--line-height-tight);
    }

    .step-header p {
      color: var(--text---body-text);
      font-size: 1.125rem;
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }

    .data-relationship-note {
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 16px;
      margin-bottom: 20px;
      text-align: center;
      flex-shrink: 0;
    }

    .relationship-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .flow-item {
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      padding: 4px 8px;
      background: var(--background---b-g-01);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-sm);
      white-space: nowrap;
    }

    .flow-arrow {
      color: var(--text---body-text);
      font-weight: var(--font-weight-bold);
    }

    .relationship-text {
      font-size: 0.875rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      margin: 0;
    }

    .import-options {
      margin-bottom: 24px;
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .import-option {
      border: 2px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 20px;
      cursor: pointer;
      transition: all var(--transition-normal);
      background: var(--background---b-g-01);
      height: fit-content;
    }

    .import-option:hover {
      border-color: var(--primary---blue--02);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .import-option.selected {
      border-color: var(--primary---blue--02);
      background: var(--background---b-g-01);
      box-shadow: var(--shadow-md);
    }

    .option-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .option-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background---b-g-03);
      border-radius: var(--border-radius-lg);
      flex-shrink: 0;
    }

    .option-info {
      flex: 1;
    }

    .option-info h3 {
      font-size: 1.25rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 4px;
    }

    .option-info p {
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }

    .checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid var(--background---b-g-04);
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-normal);
    }

    .checkbox-inner {
      width: 12px;
      height: 12px;
      border-radius: var(--border-radius-sm);
      background: transparent;
      transition: all var(--transition-normal);
    }

    .checkbox-inner.checked {
      background: var(--primary---blue--02);
    }

    .template-preview {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--background---b-g-04);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .template-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .template-header h4 {
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
    }

    .template-note {
      background: var(--info--info0);
      border: 1px solid var(--info--info3);
      border-radius: var(--border-radius-md);
      padding: 12px;
      margin-bottom: 16px;
      font-size: 0.875rem;
      color: var(--text---header);
      font-weight: var(--font-weight-semibold);
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
    }

    .template-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }

    .field-group h5 {
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---help-text);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .field-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .field-tag {
      padding: 4px 8px;
      border-radius: var(--border-radius-md);
      font-size: 0.75rem;
      font-weight: var(--font-weight-semibold);
    }

    .field-tag.mandatory {
      background: var(--warning--warning1);
      color: var(--warning--warning8);
      border: 1px solid var(--warning--warning5);
    }

    .field-tag.optional {
      background: var(--background---b-g-03);
      color: var(--text---body-text);
      border: 1px solid var(--background---b-g-04);
    }

    .format-requirements {
      background: var(--info--info0);
      border: 1px solid var(--info--info3);
      border-radius: var(--border-radius-md);
      padding: 12px;
      margin-top: 16px;
    }

    .format-requirements h5 {
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--info--info8);
      margin-bottom: 8px;
    }

    .format-requirements ul {
      margin: 0;
      padding-left: 16px;
    }

    .format-requirements li {
      font-size: 0.875rem;
      color: var(--info--info8);
      margin-bottom: 4px;
    }

    .step-actions {
      text-align: center;
      flex-shrink: 0;
      padding-top: 16px;
      border-top: 1px solid var(--background---b-g-04);
      margin-top: auto;
    }

    @media (max-width: 768px) {
      .template-fields {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .option-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .checkbox {
        align-self: center;
      }

      .template-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .relationship-flow {
        flex-direction: column;
        gap: 4px;
      }

      .flow-arrow {
        transform: rotate(90deg);
      }
    }
  `]
})
export class ImportSelectionStepComponent {
  @Input() selectedTypes: string[] = [];
  @Output() nextStep = new EventEmitter<void>();
  @Output() importTypesSelected = new EventEmitter<string[]>();

  importOptions = importOptions;

  toggleSelection(typeId: string) {
    if (this.selectedTypes.includes(typeId)) {
      this.selectedTypes = this.selectedTypes.filter(id => id !== typeId);
    } else {
      this.selectedTypes = [...this.selectedTypes, typeId];
    }
    this.importTypesSelected.emit(this.selectedTypes);
  }

  downloadTemplate(option: ImportType) {
    // Create CSV template
    const mandatoryFields = option.template.mandatory.join(',');
    const optionalFields = option.template.optional.join(',');
    const csvContent = `${mandatoryFields},${optionalFields}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessionboard_${option.name.toLowerCase().replace(/\s+/g, '_')}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onContinue() {
    this.nextStep.emit();
  }
} 