import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { formErrors } from '../../shared/models/errors';

@Component({
  selector: 'app-step-additional',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './step-additional.html',
  styleUrl: './step-additional.scss'
})
export class StepAdditional {
  public additionalInfoForm: FormGroup;

  private fb = inject(FormBuilder);
  private dataService = inject(Registration);
  private router = inject(Router);
  private errors = formErrors;

  constructor() {
    this.additionalInfoForm = this.createForm();
  }

  private createForm(): FormGroup {
    const customEmailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    const namePattern = '^[a-zA-Zа-яА-Я0-9]+$';
    return this.fb.group({
      addressCountry: ['', [Validators.required]],
      addressCity: ['', [Validators.required]],
      addressStreet: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      sex: ['', Validators.required],
      parentName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]],
      parentEmail: ['', [Validators.required, Validators.pattern(customEmailPattern)]]
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
        }
        return message;
      }
    }

    return 'Некорректное значение';
  }

  public onSubmit(): void {
    // переход к additional
    if (this.additionalInfoForm.valid) {
      this.dataService.updateData({ basicInfo: this.additionalInfoForm.value });
      this.router.navigate(['/signup', 'confirmation']);
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
}
