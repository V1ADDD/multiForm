import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { formErrors } from '../../shared/models/errors';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DateValidators } from '../../shared/models/date-validators';

@Component({
  selector: 'app-step-additional',
  imports: [ReactiveFormsModule, CustomInput, DatePipe],
  templateUrl: './step-additional.html',
  styleUrl: './step-additional.scss'
})
export class StepAdditional implements OnInit, OnDestroy {
  public additionalInfoForm: FormGroup;
  public showParentFields = false;
  public minDate = '1900-01-01';
  public maxDate = new Date();

  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private dataService = inject(Registration);
  private router = inject(Router);
  private errors = formErrors;

  constructor() {
    this.additionalInfoForm = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();
    if (!currentData.method) this.router.navigate(['/signup', 'method']);
    
    if (currentData.additionalInfo) {
      setTimeout(()=>this.additionalInfoForm.patchValue({...currentData.additionalInfo}));
      if (currentData.additionalInfo.birthDate && 
          this.getAge(new Date(currentData.additionalInfo.birthDate))) 
      {
        this.showParentFields = true;
      }
    }

    this.additionalInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$),
            debounceTime(1000))
      .subscribe(value => {
        this.dataService.updateData({ additionalInfo: value });
    });

    this.additionalInfoForm.get('birthDate')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(birthDate => {
        if (!this.additionalInfoForm.get('birthDate')?.invalid) {
          this.showParentFields = this.getAge(new Date(birthDate)) < 18;
          const parentName = this.additionalInfoForm.get('parentName');
          const parentEmail = this.additionalInfoForm.get('parentEmail');
          if (!this.showParentFields) {
            this.additionalInfoForm.patchValue({ parentName: '', parentEmail: '' });
            parentName?.clearValidators();
            parentEmail?.clearValidators();
          } else {
            const customEmailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
            const namePattern = '^[a-zA-Zа-яА-Я0-9]+$';
            parentName?.setValidators([Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]);
            parentEmail?.setValidators([Validators.required, Validators.pattern(customEmailPattern)]);
          }
          parentName?.updateValueAndValidity();
          parentEmail?.updateValueAndValidity();
        }
    })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      addressCountry: ['', Validators.required],
      addressCity: ['', Validators.required],
      addressStreet: ['', Validators.required],
      birthDate: ['', [Validators.required, DateValidators.minDate(this.minDate), DateValidators.maxDate(this.maxDate.toString())]],
      gender: ['', Validators.required],
      parentName: [''],
      parentEmail: ['']
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.additionalInfoForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    for (const errorKey in errors) {
      if (this.errors[errorKey]) {
        let message = this.errors[errorKey];
        switch (errorKey) {
          case 'minlength':
            message += errors[errorKey].requiredLength;
            break;
          case 'pattern':
            switch (fieldName) {
              case ('parentName'):
                message += '. Имя не должно содержать спец. символы';
                break;
              case ('parentEmail'):
                message += ' email';
                break;
            }
            break;
        }
        return message;
      }
    }

    return 'Некорректное значение';
  }

  public onSubmit(): void {
    if (this.additionalInfoForm.valid) {
      this.dataService.updateData({ additionalInfo: this.additionalInfoForm.value });
      this.router.navigate(['/signup', 'rules']);
    } else {
      this.markFormGroupTouched();
    }
  }

  // возвращаемся к началу
  public goBack(): void {
    this.router.navigate(['/signup', 'basic']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.additionalInfoForm.controls).forEach(key => {
      const control = this.additionalInfoForm.get(key);
      control?.markAsTouched();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
