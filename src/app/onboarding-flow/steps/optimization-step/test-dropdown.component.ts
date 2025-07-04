import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-test-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <label>Minimal Test Dropdown:</label>
      <select formControlName="field" (change)="setValue(form.get('field')?.value)">
        <option value="">-- Select Field --</option>
        <option *ngFor="let opt of options" [value]="opt">{{ opt }}</option>
      </select>
      <div style="margin-top: 12px; color: #b91c1c;">
        <strong>DEBUG:</strong> Value: {{ form.get('field')?.value }} | Options: [{{ options.join(', ') }}]
      </div>
    </form>
  `
})
export class TestDropdownComponent {
  form = new FormGroup({
    field: new FormControl('')
  });
  options = ['first name', 'last name', 'email'];

  setValue(val: string | null | undefined) {
    this.form.get('field')?.setValue(val ?? '');
    // Value updated - in production this would trigger form validation
  }
} 