import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { countries, emailPattern, namePattern } from '../../shared/models/mock-data';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { BaseFormStep } from '../../shared/component-bases/base-form-step';

@Component({
  selector: 'app-step-basic',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './step-basic.html',
  styleUrl: './step-basic.scss',
})
export class StepBasic extends BaseFormStep implements OnInit, OnDestroy {
  public override form: FormGroup;
  public showPhoneField = false;
  public countries = countries;
  private fb = inject(FormBuilder);

  constructor() {
    super();
    this.form = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();
    
    // Возврат к другой странице, если не тот метод
    if (currentData.method !== 'email') this.router.navigate(['/signup', 'method']);

    if (currentData.basicInfo) {
      setTimeout(()=>this.form.patchValue({...currentData.basicInfo}));
      if (currentData.basicInfo.country) {
        this.showPhoneField = true;
      }
    }

    this.dataService.updateData({ basicInfo: { ...this.form.value, valid: false } });

    this.subscribeToFormChanges('basic');

    // Отслеживаем изменения country, чтоб отображать ввод телефона
    this.form.get('country')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(country => {
        this.showPhoneField = !!country;

        if (!country) {
          this.form.patchValue({ phone: '' });
        }
    })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]],
      country: ['', Validators.required],
      phone: ['']
    });
  }

  public onCountryChange(countryCode: string): void {
    this.showPhoneField = !!countryCode;
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dataService.updateData({ basicInfo: { ...this.form.value, valid: true } });
      this.router.navigate(['/signup', 'additional']);
    } else {
      this.markFormGroupTouched();
    }
  }

  public goBack(): void {
    this.router.navigate(['/signup', 'method']);
  }
}
