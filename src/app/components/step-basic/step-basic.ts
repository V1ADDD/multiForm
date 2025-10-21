import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../custom-input/custom-input';
import { CountrySelect } from '../country-select/country-select';
import { Registration } from '../../services/registration';
import { Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step-basic',
  imports: [ReactiveFormsModule, CustomInput, CountrySelect],
  templateUrl: './step-basic.html',
  styleUrl: './step-basic.scss',
})
export class StepBasic implements OnInit, OnDestroy {
  public basicInfoForm: FormGroup;
  public showPhoneField = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dataService: Registration,
    private router: Router
  ) {
    this.basicInfoForm = this.createForm();
  }

  public ngOnInit(): void {
    // Подгружаем значения с ls
    const currentData = this.dataService.getCurrentData();

    if (currentData.basicInfo) {
      this.basicInfoForm.patchValue(currentData.basicInfo);

      if (currentData.basicInfo.country) {
        this.showPhoneField = true;
      }
    }

    // Отслеживаем изменения формы, дебаунс для того чтобы не отслеживать постоянно, а только когда завершили ввод чего-то
    this.basicInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$),
            debounceTime(1000))
      .subscribe(value => {
        this.dataService.updateData({ basicInfo: value });
    });

    // Отслеживаем изменения country, чтоб отображать ввод телефона
    this.basicInfoForm.get('country')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(country => {
        this.showPhoneField = !!country;

        if (!country) {
          this.basicInfoForm.patchValue({ phone: '' });
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
    if (this.basicInfoForm.valid) {
      this.dataService.updateData({ basicInfo: this.basicInfoForm.value });
      this.router.navigate(['/signup', 'additional']);
    } else {
      this.markFormGroupTouched();
    }
  }

  // возвращаемся к началу
  public goBack(): void {
    this.router.navigate(['/signup', 'method']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.basicInfoForm.controls).forEach(key => {
      const control = this.basicInfoForm.get(key);
      control?.markAsTouched();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // геттеры возможно пригодятся
  public get email() { return this.basicInfoForm.get('email'); }
  public get name() { return this.basicInfoForm.get('name'); }
  public get country() { return this.basicInfoForm.get('country'); }
  public get phone() { return this.basicInfoForm.get('phone'); }
}
