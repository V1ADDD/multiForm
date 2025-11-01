import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { formErrors } from '../models/errors';

@Injectable({
  providedIn: 'root'
})
export class FormError {
  getErrorMessage(control: AbstractControl | null, fieldName?: string): string {
    if (!control || !control.errors) return '';

    const errors = control.errors;

    for (const errorKey in errors) {
      if (formErrors[errorKey]) {
        let message = formErrors[errorKey];
        
        switch (errorKey) {
          case 'minlength':
            message += errors[errorKey].requiredLength;
            break;
          case 'pattern':
            message += this.getPatternErrorMessage(fieldName);
            break;
          case 'mindate':
          case 'maxdate':
            break;
        }
        return message;
      }
    }

    return 'Некорректное значение';
  }

  private getPatternErrorMessage(fieldName?: string): string {
    switch (fieldName) {
      case 'name':
      case 'parentName':
        return '. Имя не должно содержать спец. символы';
      case 'email':
      case 'parentEmail':
        return ' email';
      default:
        return '';
    }
  }

  isFieldInvalid(control: AbstractControl | null): boolean {
    return !!control?.invalid && (control?.dirty || control?.touched);
  }
}
