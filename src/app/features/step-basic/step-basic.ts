import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, merge } from 'rxjs';
import { countries, emailPattern, namePattern } from '../../shared/models/mock-data';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { FormError } from '../../shared/services/form-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-step-basic',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './step-basic.html',
  styleUrl: './step-basic.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepBasic implements OnInit {
  public form!: FormGroup;
  public countries = countries;

  public showPhoneField = signal(false);

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dataService = inject(Registration);
  private router = inject(Router);
  private errorService = inject(FormError);

  public ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]],
      country: ['', Validators.required],
      phone: ['']
    });
    const currentData = this.dataService.getCurrentData();

    if (currentData.basicInfo) {
      this.showPhoneField.set(!!currentData.basicInfo.country);
      this.form.patchValue({...currentData.basicInfo});
    }
    const fieldChanges = Object.keys(this.form.controls).map(fieldName => 
      this.form.get(fieldName)!.valueChanges.pipe(
        debounceTime(500)
      )
    );

    merge(...fieldChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const value = { ...this.form.value };
        value.valid = this.form.valid;
        this.dataService.updateData({ basicInfo: value });
      });

    this.form.get('country')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(country => {
        this.showPhoneField.set(!!country);
        if (!country) {
          this.form.patchValue({ phone: '' });
        }
    })
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const currentUrl = this.router.url.split('/');
      currentUrl.pop();
      this.router.navigate([currentUrl.join('/'), 'additional']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public goBack(): void {
    this.router.navigate(['/signup', 'method']);
  }

  public getErrorMessage(fieldName: string): string {
    return this.errorService.getErrorMessage(this.form.get(fieldName), fieldName);
  }

  public isFieldInvalid(fieldName: string): boolean {
    return this.errorService.isFieldInvalid(this.form.get(fieldName));
  }
}
