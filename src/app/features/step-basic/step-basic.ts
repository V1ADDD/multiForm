import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { countries } from '../../shared/models/mock-data';
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
    // Подгружаем значения с ls
    const currentData = this.dataService.getCurrentData();
    
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
    // валидация email, name через регехи и прочая валидация
    const customEmailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    const namePattern = '^[a-zA-Zа-яА-Я0-9]+$';
    return this.fb.group({
      email: ['', [Validators.required, Validators.pattern(customEmailPattern)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]],
      country: ['', Validators.required],
      phone: ['']
    });
  }

  public onCountryChange(countryCode: string): void {
    // по смене страны что делать с отображением номера ->
    this.showPhoneField = !!countryCode;
  }

  public onSubmit(): void {
    // переход к additional
    if (this.form.valid) {
      this.dataService.updateData({ basicInfo: { ...this.form.value, valid: true } });
      this.router.navigate(['/signup', 'additional']);
    } else {
      this.markFormGroupTouched();
    }
  }

  // возвращаемся к началу
  public goBack(): void {
    this.router.navigate(['/signup', 'method']);
  }
}
