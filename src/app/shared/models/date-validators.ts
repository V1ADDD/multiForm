import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class DateValidators {
  static minDate(minDate: Date | string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !minDate) return null;
      
      const selectedDate = new Date(control.value);
      const min = new Date(minDate);

      if (isNaN(selectedDate.getTime()) || isNaN(min.getTime())) {
        return null;
      }

      if (selectedDate < min) {
        return { 
          mindate: { 
            actual: control.value,
            required: minDate,
          } 
        };
      }

      return null;
    };
  }

  static maxDate(maxDate: Date | string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !maxDate) return null;
      
      const selectedDate = new Date(control.value);
      const max = new Date(maxDate);

      if (isNaN(selectedDate.getTime()) || isNaN(max.getTime())) {
        return null;
      }

      if (selectedDate > max) {
        return { 
          maxdate: { 
            actual: control.value,
            required: maxDate,
          } 
        };
      }
      return null;
    };
  }
}