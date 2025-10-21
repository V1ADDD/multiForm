import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../../services/registration';
import { RegistrationData } from '../../models/registration-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mockUser } from '../../models/mock-data';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp implements OnInit, OnDestroy {
  public methodForm: FormGroup;
  public selectedMethod: 'email' | 'social' | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dataService: Registration,
    private router: Router
  ) {
    this.methodForm = this.createForm();
  }

  public ngOnInit(): void {
    this.dataService.clearData();
    this.methodForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.dataService.updateData(value);
      })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      method: ['', Validators.required]
    });
  }

  public selectMethod(method: 'email' | 'social'): void {
    this.methodForm.patchValue({
      method
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

  public mockSocialLogin(): void {
    const mockData: RegistrationData = mockUser;

    this.dataService.updateData(mockData);

    this.router.navigate(['/signup', 'additional']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.methodForm.controls).forEach(control => {
      control?.markAsTouched();
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
