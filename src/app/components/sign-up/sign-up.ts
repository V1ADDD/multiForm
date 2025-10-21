import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Registration } from '../../services/registration';
import { RegistrationData } from '../../models/registration-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp implements OnInit {
  public methodForm: FormGroup;
  public selectedMethod: 'email' | 'social' | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: Registration,
    private router: Router
  ) {
    this.methodForm = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();
    if (currentData.method) {
      this.methodForm.patchValue({
        method: currentData.method,
        socialProvider: currentData.socialProvider || null
      });
    }
    
    this.methodForm.valueChanges.subscribe(value => {
      this.dataService.updateData(value);
    })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      method: ['', Validators.required],
      socialProvider: ['']
    });
  }

  public selectMethod(method: 'email' | 'social'): void {
    this.methodForm.patchValue({
      method,
      socialProvider: method === 'email' ? null : this.methodForm.get('socialProvider')?.value
    });
  }

  public onSubmit(): void {
    if (this.methodForm.valid) {
      this.dataService.updateData(this.methodForm.value);

      if (this.methodForm.get('method')?.value === 'email') {
        this.router.navigate(['/signup', 'basic']);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  public mockSocialLogin(provider: string): void {
    this.methodForm.patchValue({ socialProvider: provider });
    const mockData: RegistrationData = {
      method: 'social',
      socialProvider: provider,
      basicInfo: {
        email: 'john@doe.com',
        name: 'John Doe',
        country: 'by',
        phone: '(029) 111-22-33'
      },
      additionalInfo: {
        address: {
          country: 'Беларусь',
          city: 'Минск',
          street: 'Жукова'
        },
        birthDate: new Date('1990-01-01'),
        gender: 'другой'
      }
    };

    this.dataService.updateData(mockData);

    this.router.navigate(['/signup', 'additional']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.methodForm.controls).forEach(key => {
      const control = this.methodForm.get(key);
      control?.markAsTouched();
    })
  }
}
