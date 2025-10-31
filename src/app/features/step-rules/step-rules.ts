import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration } from '../../shared/services/registration';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { formErrors } from '../../shared/models/errors';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step-rules',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './step-rules.html',
  styleUrl: './step-rules.scss'
})
export class StepRules implements OnInit, OnDestroy {
  public rulesInfoForm: FormGroup;

  
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private dataService = inject(Registration);
  private router = inject(Router);
  private errors = formErrors;

  constructor() {
    this.rulesInfoForm = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();
    if (!currentData.method) this.router.navigate(['/signup', 'method']);
    
    if (currentData.confirmation) {
      setTimeout(()=>this.rulesInfoForm.patchValue({...currentData.confirmation}));
    }

    this.rulesInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$),
            debounceTime(1000))
      .subscribe(value => {
        this.dataService.updateData({ confirmation: value });
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
      acceptPrivacy: [false, Validators.requiredTrue],
      subscribe: [false]
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.rulesInfoForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    for (const errorKey in errors) {
      if (this.errors[errorKey]) {
        const message = this.errors[errorKey];
        return message;
      }
    }

    return 'Некорректное значение';
  }

  public onSubmit(): void {
    if (this.rulesInfoForm.valid) {
      this.dataService.updateData({ confirmation: this.rulesInfoForm.value });
      this.router.navigate(['/signup', 'rules']);
    } else {
      this.markFormGroupTouched();
    }
  }

  public goBack(): void {
    this.router.navigate(['/signup', 'additional']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.rulesInfoForm.controls).forEach(key => {
      const control = this.rulesInfoForm.get(key);
      control?.markAsTouched();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
