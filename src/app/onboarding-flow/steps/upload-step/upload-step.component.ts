import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-container animation-slide-up">
      <div class="step-header">
        <h2>Upload your historical event data</h2>
        <p>Bring together speaker data from multiple past events. The more historical data you import, the richer your speaker profiles become.</p>
      </div>

      <div class="guidance-section">
        <div class="upload-tips">
          <h4>💡 For the best Speaker CRM results:</h4>
          <ul>
            <li><strong>Use consistent IDs:</strong> Speaker IDs in sessions should match Speaker email addresses</li>
            <li><strong>Include event relationships:</strong> Session Event IDs should match your Event names or IDs</li>
            <li><strong>Each session builds speaker history:</strong> Multiple sessions per speaker create a rich profile</li>
            <li><strong>Template recommended:</strong> Using Sessionboard templates ensures proper data connections</li>
          </ul>
        </div>
      </div>

      <div class="upload-area">
        <div 
          class="drop-zone"
          [class.dragover]="isDragOver"
          [class.uploading]="isUploading"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()">
          
          <div class="upload-content" *ngIf="!isUploading">
            <div class="upload-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Drop your historical data files here</h3>
            <p>or click to browse your files</p>
            <div class="file-types">
              <span class="file-type">CSV</span>
              <span class="file-type">Excel</span>
            </div>
            <div class="format-reminder">
              <strong>Remember:</strong> UTF-8 encoding, max 1000 records per file
            </div>
          </div>

          <!-- Upload Progress -->
          <div class="upload-progress" *ngIf="isUploading">
            <div class="progress-circle">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="36" 
                  stroke="var(--background---b-g-04)" 
                  stroke-width="4" 
                  fill="none"/>
                <circle 
                  cx="40" 
                  cy="40" 
                  r="36" 
                  stroke="var(--primary---blue--02)" 
                  stroke-width="4" 
                  fill="none"
                  stroke-dasharray="226.2"
                  [attr.stroke-dashoffset]="226.2 - (226.2 * uploadProgress / 100)"
                  transform="rotate(-90 40 40)"/>
              </svg>
              <div class="progress-text">{{ uploadProgress }}%</div>
            </div>
            <h3>Uploading your historical data...</h3>
            <p>{{ currentFileName }}</p>
          </div>
        </div>

        <input 
          #fileInput
          type="file" 
          multiple 
          accept=".csv,.xlsx,.xls"
          (change)="onFileSelected($event)"
          style="display: none;">
      </div>

      <!-- File List -->
      <div class="file-list" *ngIf="uploadedFiles.length > 0">
        <h4>📊 Assign Data Types to Build Speaker Connections</h4>
        <p class="assignment-note">Tell us what type of data each file contains so we can connect speakers across events and sessions.</p>
        
        <table class="file-assignment-table">
          <thead>
            <tr>
              <th class="file-name-header">File Name</th>
              <th class="type-header">Data Type</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let file of uploadedFiles; let i = index">
              <td class="file-name-cell">
                <div class="file-name-text" [title]="file.name">{{ file.name }}</div>
                <div class="file-size">{{ formatFileSize(file.size) }}</div>
              </td>
              <td class="type-cell">
                <label for="type-select-{{i}}" class="dropdown-label">Assign Type</label>
                <select
                  id="type-select-{{i}}"
                  class="type-dropdown"
                  [(ngModel)]="fileTypeAssignments[i]"
                  (ngModelChange)="onTypeAssignment(i)"
                >
                  <option value="">Select data type...</option>
                  <option *ngFor="let type of selectedTypes" [value]="type">{{ getDataTypeName(type) }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="connection-preview" *ngIf="hasAssignments()">
          <h5>🔗 Data Connections Preview</h5>
          <div class="connection-flow">
            <div class="connection-item" *ngFor="let assignment of getAssignmentSummary()">
              <span class="connection-count">{{ assignment.count }}</span>
              <span class="connection-type">{{ assignment.type }}</span>
            </div>
          </div>
          <p class="connection-note">These files will be connected to build your comprehensive speaker lifecycle view</p>
        </div>

        <button class="btn btn-primary btn-large cta-btn" 
                (click)="emitAssignments()"
                [disabled]="!allFilesAssigned()">
          Build My Speaker Database →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
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

    .guidance-section {
      margin-bottom: 20px;
      flex-shrink: 0;
    }

    .upload-tips {
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 16px;
    }

    .upload-tips h4 {
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 12px;
    }

    .upload-tips ul {
      margin: 0;
      padding-left: 16px;
    }

    .upload-tips li {
      font-size: 0.875rem;
      color: var(--text---body-text);
      margin-bottom: 8px;
      line-height: var(--line-height-normal);
      font-weight: var(--font-weight-regular);
    }

    .upload-area {
      margin-bottom: 24px;
      flex-shrink: 0;
    }

    .drop-zone {
      border: 3px dashed var(--background---b-g-04);
      border-radius: var(--border-radius-xl);
      padding: 40px 30px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-slow);
      background: var(--background---b-g-02);
      position: relative;
      overflow: hidden;
    }

    .drop-zone:hover {
      border-color: var(--primary---blue--02);
      background: var(--background---b-g-03);
    }

    .drop-zone.dragover {
      border-color: var(--primary---blue--02);
      background: var(--background---b-g-03);
      transform: scale(1.02);
    }

    .drop-zone.uploading {
      border-color: var(--primary---blue--02);
      background: var(--background---b-g-03);
    }

    .upload-content h3 {
      font-size: 1.5rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin: 16px 0 8px 0;
    }

    .upload-content p {
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      margin-bottom: 24px;
    }

    .upload-icon {
      color: var(--text---help-text);
      margin-bottom: 16px;
    }

    .file-types {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .file-type {
      padding: 6px 12px;
      background: var(--background---b-g-01);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-xl);
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---body-text);
    }

    .format-reminder {
      font-size: 0.875rem;
      color: var(--text---help-text);
      font-weight: var(--font-weight-light);
      padding: 12px;
      background: var(--background---b-g-01);
      border-radius: var(--border-radius-md);
      margin-top: 16px;
    }

    .upload-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .progress-circle {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-text {
      position: absolute;
      font-size: 1.25rem;
      font-weight: var(--font-weight-semibold);
      color: var(--primary---blue--02);
    }

    .file-list {
      margin-bottom: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .file-list h4 {
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 8px;
    }

    .assignment-note {
      color: var(--text---body-text);
      font-size: 0.875rem;
      font-weight: var(--font-weight-regular);
      margin-bottom: 20px;
      line-height: var(--line-height-normal);
    }

    .file-assignment-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: var(--background---b-g-01);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .file-name-header, .type-header {
      background: var(--background---b-g-02);
      padding: 16px 20px;
      text-align: left;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      border-bottom: 1px solid var(--background---b-g-04);
    }

    .file-name-header {
      width: 60%;
    }

    .type-header {
      width: 40%;
    }

    .file-name-cell, .type-cell {
      padding: 16px 20px;
      border-bottom: 1px solid var(--background---b-g-03);
      vertical-align: top;
    }

    .file-name-text {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 4px;
    }

    .file-size {
      font-size: 0.875rem;
      color: var(--text---help-text);
      font-weight: var(--font-weight-light);
    }

    .type-dropdown {
      width: 100%;
      max-width: 160px;
      padding: 8px 32px 8px 12px;
      font-size: 0.9rem;
      font-weight: var(--font-weight-regular);
      border: 1.5px solid var(--background---b-g-04);
      border-radius: var(--border-radius-md);
      background: var(--background---b-g-01);
      transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23868686' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 8px center;
      background-repeat: no-repeat;
      background-size: 16px 12px;
    }

    .type-dropdown:focus {
      border-color: var(--primary---blue--02);
      box-shadow: var(--shadow-focus);
      outline: none;
    }

    .dropdown-label {
      display: block;
      font-size: 0.75rem;
      color: var(--text---help-text);
      margin-bottom: 6px;
      font-weight: var(--font-weight-semibold);
    }

    .connection-preview {
      background: var(--background---b-g-02);
      border: 1px solid var(--background---b-g-04);
      border-radius: var(--border-radius-lg);
      padding: 20px;
      margin-bottom: 24px;
    }

    .connection-preview h5 {
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---header);
      margin-bottom: 12px;
      text-align: center;
    }

    .connection-flow {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .connection-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .connection-count {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--text---header);
    }

    .connection-type {
      font-size: 0.875rem;
      font-weight: var(--font-weight-semibold);
      color: var(--text---body-text);
      text-align: center;
    }

    .connection-note {
      font-size: 0.875rem;
      color: var(--text---body-text);
      font-weight: var(--font-weight-regular);
      text-align: center;
      margin: 0;
    }

    .cta-btn {
      margin-top: 8px;
      padding: 16px 40px;
      font-size: 1.125rem;
      font-weight: var(--font-weight-semibold);
      border-radius: var(--border-radius-lg);
      background: var(--primary---blue--02);
      color: var(--background---b-g-01);
      box-shadow: var(--shadow-md);
      border: none;
      transition: all var(--transition-normal);
      cursor: pointer;
      display: block;
      width: 100%;
    }

    .cta-btn:hover:not(:disabled) {
      background: var(--primary---blue--03);
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .cta-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 768px) {
      .drop-zone {
        padding: 40px 20px;
      }

      .upload-content h3 {
        font-size: 1.25rem;
      }

      .file-types {
        flex-wrap: wrap;
      }

      .connection-flow {
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class UploadStepComponent {
  @Input() selectedTypes: string[] = [];
  @Output() filesUploaded = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<void>();

  uploadedFiles: File[] = [];
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  currentFileName = '';
  fileTypeAssignments: string[] = [];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  private async handleFiles(files: File[]) {
    this.isUploading = true;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.currentFileName = file.name;
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        this.uploadProgress = progress;
        await this.delay(100);
      }
      
      this.uploadedFiles.push(file);
    }
    
    this.isUploading = false;
    this.uploadProgress = 0;
    this.currentFileName = '';
    this.fileTypeAssignments = this.uploadedFiles.map(() => '');
  }

  onTypeAssignment(index: number) {
    // Could trigger validation or preview logic here
  }

  getDataTypeName(typeId: string): string {
    const typeNames: { [key: string]: string } = {
      'events': 'Past Events',
      'speakers': 'Speaker Profiles', 
      'sessions': 'Speaking Sessions',
      'users': 'Team Members'
    };
    return typeNames[typeId] || typeId;
  }

  hasAssignments(): boolean {
    return this.fileTypeAssignments.some(assignment => assignment !== '');
  }

  allFilesAssigned(): boolean {
    return this.uploadedFiles.length > 0 && 
           this.fileTypeAssignments.every(assignment => assignment !== '');
  }

  getAssignmentSummary() {
    const summary: { [key: string]: number } = {};
    this.fileTypeAssignments.forEach(assignment => {
      if (assignment) {
        summary[assignment] = (summary[assignment] || 0) + 1;
      }
    });

    return Object.entries(summary).map(([type, count]) => ({
      type: this.getDataTypeName(type),
      count: count
    }));
  }

  emitAssignments() {
    const assignments = this.uploadedFiles.map((file, i) => ({
      file,
      type: this.fileTypeAssignments[i]
    }));
    this.filesUploaded.emit(assignments);
    this.nextStep.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 