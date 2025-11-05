import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { debounceTime } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DateValidators } from '../../shared/models/date-validators';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { FormError } from '../../shared/services/form-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { birthDateValidator } from '../../shared/validators/birthDateValidator';

@Component({
  selector: 'app-step-additional',
  imports: [ReactiveFormsModule, CustomInput, DatePipe],
  templateUrl: './step-additional.html',
  styleUrl: './step-additional.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepAdditional implements OnInit {
  public form!: FormGroup;
  public showParentFields = true;
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
    }, { validators: birthDateValidator.bind(this) });
    const currentData = this.dataService.getCurrentData();
    
    if (currentData.additionalInfo) {
      this.form.patchValue({...currentData.additionalInfo});
    }

    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500)
    ).subscribe(value => {
        value.valid = this.form.valid;
        this.dataService.updateData({ additionalInfo: value })
    });
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

  public parentsRequired(): boolean {
    const parentEmail = this.form.get('parentEmail');
    const parentName = this.form.get('parentName');
    if (parentName?.validator && parentEmail?.validator) {
      return true;
    }
    else {
      parentEmail?.setValue('');
      parentName?.setValue('');
      return false;
    }
  }
}
