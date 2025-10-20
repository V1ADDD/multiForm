import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../custom-input/custom-input';
import { CountrySelect } from '../country-select/country-select';
import { Registration } from '../../services/registration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-basic',
  imports: [ReactiveFormsModule, CustomInput, CountrySelect],
  templateUrl: './step-basic.html',
  styleUrl: './step-basic.scss'
})
export class StepBasic implements OnInit {
  public basicInfoForm: FormGroup;
  public showPhoneField = false;

  constructor(
    private fb: FormBuilder,
    private dataService: Registration,
    private router: Router
  ) {
    this.basicInfoForm = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();

    if (currentData.basicInfo) {
      this.basicInfoForm.patchValue(currentData.basicInfo);

      if (currentData.basicInfo.country) {
        this.showPhoneField = true;
      }
    }

    this.basicInfoForm.valueChanges.subscribe(value => {
      this.dataService.updateData({ basicInfo: value });
    });

    this.basicInfoForm.get('country')?.valueChanges.subscribe(country => {
      this.showPhoneField = !!country;

      if (!country) {
        this.basicInfoForm.patchValue({ phone: '' });
      }
    })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      phone: ['']
    });
  }

  public onCountryChange(countryCode: string): void {
    this.showPhoneField = !!countryCode;
    console.log('Selected country:', countryCode);
  }

  public onSubmit(): void {
    if (this.basicInfoForm.valid) {
      this.dataService.updateData({ basicInfo: this.basicInfoForm.value });
      this.router.navigate(['/signup', 'additional']);
    } else {
      this.markFormGroupTouched();
    }
  }

  public goBack(): void {
    this.router.navigate(['/signup', 'method']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.basicInfoForm.controls).forEach(key => {
      const control = this.basicInfoForm.get(key);
      control?.markAsTouched();
    });
  }

  public get email() { return this.basicInfoForm.get('email'); }
  public get name() { return this.basicInfoForm.get('name'); }
  public get country() { return this.basicInfoForm.get('country'); }
  public get phone() { return this.basicInfoForm.get('phone'); }
}
