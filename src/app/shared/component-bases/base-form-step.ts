import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration } from '../services/registration';
import { RegistrationStep } from '../models/registration-types';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FormError } from '../services/form-error';

@Directive()
export abstract class BaseFormStep implements OnInit, OnDestroy {
  protected abstract form: FormGroup;
  
  protected destroy$ = new Subject<void>();
  protected dataService = inject(Registration);
  protected router = inject(Router);
  protected errorService = inject(FormError);

  public abstract ngOnInit(): void;

  protected markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  protected subscribeToFormChanges(step: RegistrationStep): void {
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500)
    ).subscribe(value => {
        switch (step) {
            case 'method':
                this.dataService.updateData(value);
                break;
            case 'basic':
                this.dataService.updateData({ basicInfo: value });
                break;
            case 'additional':
                this.dataService.updateData({ additionalInfo: value });
                break;
            case 'confirmation':
                this.dataService.updateData({ confirmation: value });
        }
    });
  }
  
  public getErrorMessage(fieldName: string): string {
    return this.errorService.getErrorMessage(this.form.get(fieldName), fieldName);
  }

  public isFieldInvalid(fieldName: string): boolean {
    return this.errorService.isFieldInvalid(this.form.get(fieldName));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}