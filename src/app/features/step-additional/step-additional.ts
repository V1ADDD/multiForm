import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { debounceTime } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DateValidators } from '../../shared/models/date-validators';
import { emailPattern, namePattern } from '../../shared/models/mock-data';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { FormError } from '../../shared/services/form-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-step-additional',
  imports: [ReactiveFormsModule, CustomInput, DatePipe],
  templateUrl: './step-additional.html',
  styleUrl: './step-additional.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepAdditional implements OnInit {
  public form!: FormGroup;
  public showParentFields = false;
  public minDate = '1900-01-01';
  public maxDate = new Date();

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dataService = inject(Registration);
  private router = inject(Router);
  private errorService = inject(FormError);

  public ngOnInit(): void {
    this.form = this.fb.group({
      addressCountry: ['', Validators.required],
      addressCity: ['', Validators.required],
      addressStreet: ['', Validators.required],
      birthDate: ['', [Validators.required, DateValidators.minDate(this.minDate), DateValidators.maxDate(this.maxDate.toString())]],
      gender: ['', Validators.required],
      parentName: [''],
      parentEmail: ['']
    });
    const currentData = this.dataService.getCurrentData();
    
    if (currentData.additionalInfo) {
      this.form.patchValue({...currentData.additionalInfo});
      if (currentData.additionalInfo.birthDate && 
          this.getAge(new Date(currentData.additionalInfo.birthDate)) < 18) 
      {
        this.showParentFields = true;
      }
    }

    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500)
    ).subscribe(value => {
        value.valid = this.form.valid;
        this.dataService.updateData({ additionalInfo: value })
    });

    this.form.get('birthDate')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(birthDate => {
        if (!this.form.get('birthDate')?.invalid) {
          this.showParentFields = this.getAge(new Date(birthDate)) < 18;
          const parentName = this.form.get('parentName');
          const parentEmail = this.form.get('parentEmail');
          if (!this.showParentFields) {
            this.form.patchValue({ parentName: '', parentEmail: '' });
            parentName?.clearValidators();
            parentEmail?.clearValidators();
          } else {
            parentName?.setValidators([Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]);
            parentEmail?.setValidators([Validators.required, Validators.pattern(emailPattern)]);
          }
          parentName?.updateValueAndValidity();
          parentEmail?.updateValueAndValidity();
        }
    })
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const currentUrl = this.router.url.split('/');
      currentUrl.pop();
      this.router.navigate([currentUrl.join('/'), 'rules']);
    } else {
      this.form.markAllAsTouched();
    }
  }
  
  public goBack(): void {
    const currentUrl = this.router.url.split('/');
    currentUrl.pop();
    this.router.navigate([currentUrl.join('/'), 'basic']);
  }

  public getErrorMessage(fieldName: string): string {
    return this.errorService.getErrorMessage(this.form.get(fieldName), fieldName);
  }

  public isFieldInvalid(fieldName: string): boolean {
    return this.errorService.isFieldInvalid(this.form.get(fieldName));
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  private getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
