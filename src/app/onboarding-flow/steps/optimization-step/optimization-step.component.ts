import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { FileParserService, ParsedFile } from '../../../services/file-parser.service';
import { LevenshteinService, FieldMatch } from '../../../services/levenshtein.service';
import { importOptions } from '../../../config/import-types.config';
import { TestDropdownComponent } from './test-dropdown.component';

export interface FileFieldMapping {
  fileName: string;
  recordType: string;
  columns: string[];
  mappings: { [key: string]: string };
  systemFields: string[];
}

export interface NewFieldSuggestion {
  id: string;
  fieldName: string;
  description: string;
  foundInFiles: string[];
  status: 'pending' | 'creating' | 'created' | 'skipped';
}

export interface FieldMappingSuggestion {
  id: string;
  sourceField: string;
  targetField: string;
  description: string;
  confidence: number;
  userChoice: 'pending' | 'yes' | 'no';
  foundInFiles: string[];
}

@Component({
  selector: 'app-optimization-step',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TestDropdownComponent],
  template: `
    <div class="optimization-container animation-slide-up">
      <div class="step-header">
        <h2>Optimize Your Speaker CRM Data</h2>
        <p>We've analyzed your files and found opportunities to improve your speaker database connections.</p>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions" *ngIf="hasAnyPendingSuggestions()">
        <button class="btn btn-secondary" (click)="acceptAllSuggestions()">
          ✓ Accept All Suggestions
        </button>
        <span class="quick-actions-text">or review each suggestion individually below</span>
      </div>

      <div class="optimization-sections">
        <!-- Field Mapping Suggestions -->
        <div class="optimization-section" *ngIf="fieldMappingSuggestions.length > 0">
          <h3>🔗 Possible Field Duplications</h3>
          <p class="section-description">Fields in your files that might match existing Sessionboard fields.</p>
          
          <div class="optimization-cards">
            <div 
              *ngFor="let mapping of fieldMappingSuggestions; trackBy: trackByMappingId" 
              class="optimization-card mapping-card"
              [class.approved]="mapping.userChoice === 'yes'"
              [class.declined]="mapping.userChoice === 'no'">
              
              <div class="card-header">
                <div class="card-title">
                  <span class="field-name">"{{ mapping.sourceField }}"</span>
                  <span class="arrow">→</span>
                  <span class="field-name">"{{ mapping.targetField }}"</span>
                </div>
                <div class="confidence-badge" [class.high-confidence]="mapping.confidence > 0.8">
                  {{ (mapping.confidence * 100) | number:'1.0-0' }}%
                </div>
              </div>
              
              <p class="card-description">{{ mapping.description }}</p>
              
              <div class="card-actions">
                <button 
                  class="btn btn-primary btn-sm"
                  [class.selected]="mapping.userChoice === 'yes'"
                  (click)="updateMappingChoice(mapping.id, 'yes')">
                  ✓ Yes
                </button>
                <button 
                  class="btn btn-ghost btn-sm"
                  [class.selected]="mapping.userChoice === 'no'"
                  (click)="updateMappingChoice(mapping.id, 'no')">
                  ✗ No
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- New Field Suggestions -->
        <div class="optimization-section" *ngIf="newFieldSuggestions.length > 0">
          <h3>➕ New Field Suggestions</h3>
          <p class="section-description">Fields in your data that don't exist in Sessionboard yet.</p>
          
          <div class="optimization-cards">
            <div 
              *ngFor="let field of newFieldSuggestions; trackBy: trackByFieldId" 
              class="optimization-card new-field-card"
              [class.creating]="field.status === 'creating'"
              [class.created]="field.status === 'created'"
              [class.skipped]="field.status === 'skipped'">
              
              <div class="card-header">
                <div class="card-title">
                  <span class="field-name">"{{ field.fieldName }}"</span>
                  <div class="status-indicator" *ngIf="field.status !== 'pending'">
                    <span *ngIf="field.status === 'creating'" class="status creating">
                      <div class="spinner"></div> Creating...
                    </span>
                    <span *ngIf="field.status === 'created'" class="status created">
                      ✓ Created
                    </span>
                    <span *ngIf="field.status === 'skipped'" class="status skipped">
                      ✗ Skipped
                    </span>
                  </div>
                </div>
              </div>
              
              <p class="card-description">{{ field.description }}</p>
              
              <div class="card-actions" *ngIf="field.status === 'pending'">
                <button 
                  class="btn btn-primary btn-sm"
                  (click)="createNewField(field.id)">
                  ✓ Create
                </button>
                <button 
                  class="btn btn-ghost btn-sm"
                  (click)="skipNewField(field.id)">
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- Progress Summary -->
      <div class="progress-summary">
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-number">{{ getCompletedOptimizations() }}</span>
            <span class="stat-label">Optimizations Complete</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getTotalOptimizations() }}</span>
            <span class="stat-label">Total Suggestions</span>
          </div>
        </div>
        
        <button 
          class="btn btn-primary btn-large"
          (click)="onContinue()"
          [disabled]="!canContinue()">
          Apply Optimizations & Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .optimization-container {
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

    .quick-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px;
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      flex-shrink: 0;
    }

    .quick-actions-text {
      color: var(--text---help-text);
      font-size: 0.875rem;
      font-weight: var(--font-weight-regular);
    }

    .optimization-sections {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      overflow-y: auto;
      margin-bottom: 20px;
    }

    .optimization-section {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .optimization-section h3 {
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 6px;
    }

    .section-description {
      color: var(--text---body-text);
      font-size: 0.875rem;
      font-weight: var(--font-weight-regular);
      margin-bottom: 12px;
      line-height: var(--line-height-normal);
    }

    .optimization-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      overflow-y: auto;
    }

    .optimization-card {
      background: var(--background---b-g-01);
      border: 2px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 16px;
      transition: all var(--transition-normal);
    }

    .optimization-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .optimization-card.approved {
      border-color: var(--success--success5);
      background: var(--success--success0);
    }

    .optimization-card.declined {
      border-color: var(--background---b-g-04);
      opacity: 0.7;
    }

    .optimization-card.creating {
      border-color: var(--primary---blue--02);
      background: var(--primary---blue--01);
    }

    .optimization-card.created {
      border-color: var(--success--success5);
      background: var(--success--success0);
    }

    .optimization-card.skipped {
      border-color: var(--background---b-g-04);
      opacity: 0.7;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .field-name {
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      background: var(--background---b-g-03);
      padding: 2px 6px;
      border-radius: var(--border-radius-sm);
      font-family: monospace;
      font-size: 0.75rem;
    }

    .arrow {
      color: var(--text---help-text);
      font-weight: var(--font-weight-bold);
    }

    .confidence-badge {
      background: var(--background---b-g-03);
      color: var(--text---body-text);
      padding: 4px 8px;
      border-radius: var(--border-radius-md);
      font-size: 0.75rem;
      font-weight: var(--font-weight-semibold);
    }

    .confidence-badge.high-confidence {
      background: var(--success--success2);
      color: var(--success--success7);
    }

    .status-indicator {
      display: flex;
      align-items: center;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      padding: 4px 8px;
      border-radius: var(--border-radius-md);
    }

    .status.creating {
      background: var(--primary---blue--02);
      color: var(--background---b-g-01);
    }

    .status.created {
      background: var(--success--success5);
      color: var(--background---b-g-01);
    }

    .status.skipped {
      background: var(--background---b-g-04);
      color: var(--text---help-text);
    }

    .spinner {
      width: 12px;
      height: 12px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .card-description {
      color: var(--text---body-text);
      font-size: 0.875rem;
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      margin-bottom: 12px;
    }



    .card-actions {
      display: flex;
      gap: 12px;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
    }

    .btn-sm.selected {
      background: var(--primary---blue--02);
      color: var(--background---b-g-01);
      border-color: var(--primary---blue--02);
    }

    .btn-ghost.selected {
      background: var(--background---b-g-04);
      color: var(--text---header);
      border-color: var(--background---b-g-04);
    }

    .progress-summary {
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 16px 24px;
      text-align: center;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .summary-stats {
      display: flex;
      gap: 24px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary---blue--02);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text---help-text);
      font-weight: var(--font-weight-semibold);
    }

    .btn-large {
      padding: 16px 32px;
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        gap: 8px;
      }

      .card-actions {
        flex-direction: column;
      }

      .summary-stats {
        gap: 20px;
      }
    }
  `]
})
export class OptimizationStepComponent implements OnInit, OnChanges {
  @Input() fileAssignments: any[] = [];
  @Output() nextStep = new EventEmitter<void>();
  @Output() optimizationsUpdated = new EventEmitter<any>();

  files: { name: string; columns: string[]; systemFields: string[]; type: string }[] = [];
  formArray: FormArray<FormGroup> = new FormArray<FormGroup>([]);
  globalOptimizations: any[] = [];
  newFieldSuggestions: NewFieldSuggestion[] = [];
  fieldMappingSuggestions: FieldMappingSuggestion[] = [];
  private previousFileAssignmentsRef: any = null;

  constructor(
    private fileParser: FileParserService,
    private levenshteinService: LevenshteinService
  ) {}

  async ngOnInit() {
    await this.parseFiles();
    this.generateOptimizations();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['fileAssignments'] && this.fileAssignments !== this.previousFileAssignmentsRef) {
      this.previousFileAssignmentsRef = this.fileAssignments;
      await this.parseFiles();
      this.generateOptimizations();
    }
  }

  private async parseFiles() {
    this.files = [];
    this.formArray = new FormArray<FormGroup>([]);

    for (const assignment of this.fileAssignments) {
      if (assignment.file && assignment.type) {
        const parsedFile = await this.fileParser.parseFile(assignment.file, assignment.type);
        const systemFields = this.getSystemFieldsForRecordType(assignment.type);
        
        this.files.push({
          name: assignment.file.name,
          columns: parsedFile.columns,
          systemFields: systemFields,
          type: assignment.type
        });

        // Create form group for this file
        const formGroup = new FormGroup({});
        for (const col of parsedFile.columns) {
          const bestMatch = this.getFieldSuggestions(col, systemFields)[0];
          formGroup.addControl(col, new FormControl(bestMatch?.suggestedField || ''));
        }
        this.formArray.push(formGroup);
      }
    }
  }

  private generateOptimizations() {
    // Generate new field suggestions
    this.newFieldSuggestions = [
      {
        id: 'nf1',
        fieldName: 'Key Takeaway',
        description: 'A field to capture the main insight or takeaway from each speaking session.',
        foundInFiles: ['sessions_2023.csv', 'conference_data.csv'],
        status: 'pending'
      },
      {
        id: 'nf2',
        fieldName: 'Speaker Rating',
        description: 'Audience feedback rating for speaker performance (1-5 scale).',
        foundInFiles: ['feedback_data.csv'],
        status: 'pending'
      },
      {
        id: 'nf3',
        fieldName: 'Travel Required',
        description: 'Whether the speaker needs travel accommodation for the event.',
        foundInFiles: ['speakers_2023.csv'],
        status: 'pending'
      },
      {
        id: 'nf4',
        fieldName: 'Session Type',
        description: 'Type of session (Keynote, Workshop, Panel, Lightning Talk).',
        foundInFiles: ['sessions_2023.csv', 'conference_data.csv'],
        status: 'pending'
      }
    ];

    // Generate field mapping suggestions
    this.fieldMappingSuggestions = [
      {
        id: 'fm1',
        sourceField: 'Bio',
        targetField: 'Biography',
        description: 'Your "Bio" field appears to match our existing "Biography" field.',
        confidence: 0.95,
        userChoice: 'pending',
        foundInFiles: ['speakers_2023.csv']
      },
      {
        id: 'fm2',
        sourceField: 'Company Name',
        targetField: 'Company',
        description: 'Your "Company Name" field matches our "Company" field.',
        confidence: 0.88,
        userChoice: 'pending',
        foundInFiles: ['speakers_2023.csv', 'contacts.csv']
      },
      {
        id: 'fm3',
        sourceField: 'Phone Number',
        targetField: 'Phone',
        description: 'Your "Phone Number" field can be mapped to our "Phone" field.',
        confidence: 0.92,
        userChoice: 'pending',
        foundInFiles: ['contacts.csv']
      }
    ];

    // Speaker connections functionality has been removed
  }

  updateMappingChoice(mappingId: string, choice: 'yes' | 'no') {
    const mapping = this.fieldMappingSuggestions.find(m => m.id === mappingId);
    if (mapping) {
      mapping.userChoice = choice;
    }
  }

  async createNewField(fieldId: string) {
    const field = this.newFieldSuggestions.find(f => f.id === fieldId);
    if (field) {
      field.status = 'creating';
      
      // Simulate field creation API call
      await this.delay(2000);
      
      field.status = 'created';
    }
  }

  skipNewField(fieldId: string) {
    const field = this.newFieldSuggestions.find(f => f.id === fieldId);
    if (field) {
      field.status = 'skipped';
    }
  }

  // Note: Speaker connections functionality has been removed
  // This method is kept for potential future use
  approveConnection(connectionId: string) {
    // Connection approval logic would go here
  }

  getCompletedOptimizations(): number {
    const completedFields = this.newFieldSuggestions.filter(f => f.status === 'created' || f.status === 'skipped').length;
    const completedMappings = this.fieldMappingSuggestions.filter(m => m.userChoice !== 'pending').length;
    return completedFields + completedMappings;
  }

  getTotalOptimizations(): number {
    return this.newFieldSuggestions.length + this.fieldMappingSuggestions.length;
  }

  canContinue(): boolean {
    const allFieldsProcessed = this.newFieldSuggestions.every(f => f.status !== 'pending' && f.status !== 'creating');
    const allMappingsDecided = this.fieldMappingSuggestions.every(m => m.userChoice !== 'pending');
    return allFieldsProcessed && allMappingsDecided;
  }

  trackByFieldId(index: number, field: NewFieldSuggestion): string {
    return field.id;
  }

  trackByMappingId(index: number, mapping: FieldMappingSuggestion): string {
    return mapping.id;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getFieldSuggestions(sourceField: string, systemFields: string[]): FieldMatch[] {
    return this.levenshteinService.getAllMatches(sourceField, systemFields);
  }

  onContinue() {
    const optimizationResults = {
      newFields: this.newFieldSuggestions.filter(f => f.status === 'created'),
      fieldMappings: this.fieldMappingSuggestions.filter(m => m.userChoice === 'yes')
    };

    this.optimizationsUpdated.emit(optimizationResults);
    this.nextStep.emit();
  }

  private getSystemFieldsForRecordType(recordType: string): string[] {
    const option = importOptions.find(opt => opt.id === recordType);
    if (option) {
      return [...option.template.mandatory, ...option.template.optional];
    }
    return [];
  }

  hasAnyPendingSuggestions(): boolean {
    const hasPendingFields = this.newFieldSuggestions.some(f => f.status === 'pending');
    const hasPendingMappings = this.fieldMappingSuggestions.some(m => m.userChoice === 'pending');
    return hasPendingFields || hasPendingMappings;
  }

  acceptAllSuggestions() {
    // Accept all field mapping suggestions
    this.fieldMappingSuggestions.forEach(mapping => {
      if (mapping.userChoice === 'pending') {
        mapping.userChoice = 'yes';
      }
    });

    // Create all new field suggestions
    this.newFieldSuggestions.forEach(async (field) => {
      if (field.status === 'pending') {
        await this.createNewField(field.id);
      }
    });
  }
} 