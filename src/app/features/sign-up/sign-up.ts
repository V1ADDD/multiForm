import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RegistrationData } from '../../shared/models/registration-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mockUser } from '../../shared/models/mock-data';
import { BaseFormStep } from '../../shared/component-bases/base-form-step';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp extends BaseFormStep implements OnInit, OnDestroy {
  protected override form: FormGroup;
  public selectedMethod: 'email' | 'social' | null = null;
  private fb = inject(FormBuilder);

  constructor() {
    super();
    this.form = this.createForm();
  }

  public override ngOnInit(): void {
    this.dataService.clearData();
    this.subscribeToFormChanges('method');
  }

  private createForm(): FormGroup {
    return this.fb.group({
      method: ['', Validators.required]
    });
  }

  public selectMethod(method: 'email' | 'social'): void {
    this.form.patchValue({
      method
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dataService.updateData(this.form.value);
      if (this.form.get('method')?.value === 'email') {
        this.router.navigate(['/signup', 'basic']);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  public mockSocialLogin(): void {
    const mockData: RegistrationData = mockUser;
    this.dataService.updateData(mockData);
    this.router.navigate(['/signup', 'additional']);
  }
}
