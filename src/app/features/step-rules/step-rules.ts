import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { FormError } from '../../shared/services/form-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, merge } from 'rxjs';

@Component({
  selector: 'app-step-rules',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './step-rules.html',
  styleUrl: './step-rules.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepRules implements OnInit {
  public form!: FormGroup;

  private fb = inject(FormBuilder);
  protected destroyRef = inject(DestroyRef)
  protected dataService = inject(Registration);
  protected router = inject(Router);
  protected errorService = inject(FormError);

  public ngOnInit(): void {
    this.form = this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
      acceptPrivacy: [false, Validators.requiredTrue],
      subscribe: [false]
    });
    const currentData = this.dataService.getCurrentData();
    
    if (currentData.confirmation) {
      this.form.patchValue({...currentData.confirmation});
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
        this.dataService.updateData({ confirmation: value });
      });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      alert("Успешно!");
    } else {
      this.form.markAllAsTouched();
    }
  }

  public goBack(): void {
    const currentUrl = this.router.url.split('/');
    currentUrl.pop();
    this.router.navigate([currentUrl.join('/'), 'additional']);
  }

  public getErrorMessage(fieldName: string): string {
    return this.errorService.getErrorMessage(this.form.get(fieldName), fieldName);
  }

  public isFieldInvalid(fieldName: string): boolean {
    return this.errorService.isFieldInvalid(this.form.get(fieldName));
  }
}
