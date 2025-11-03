import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { Location } from '@angular/common';
import { Registration } from '../../shared/services/registration';
import { Router } from '@angular/router';
import { FormError } from '../../shared/services/form-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

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
  private location = inject(Location);
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

    // Возврат к другой странице, если не тот метод или невалидность предыдущих форм
    if (!currentData.method) this.router.navigate(['/signup', 'method']);
    if (!currentData.additionalInfo?.valid || !currentData.basicInfo?.valid) this.location.back();
    
    if (currentData.confirmation) {
      this.form.patchValue({...currentData.confirmation});
    }

    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500)
    ).subscribe(value => this.dataService.updateData({ confirmation: value }));
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dataService.updateData({ confirmation: this.form.value });
      this.router.navigate(['/signup', 'rules']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public goBack(): void {
    this.router.navigate(['/signup', 'additional']);
  }

  public getErrorMessage(fieldName: string): string {
    return this.errorService.getErrorMessage(this.form.get(fieldName), fieldName);
  }

  public isFieldInvalid(fieldName: string): boolean {
    return this.errorService.isFieldInvalid(this.form.get(fieldName));
  }
}
