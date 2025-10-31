import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../../shared/services/registration';
import { RegistrationData } from '../../shared/models/registration-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mockUser } from '../../shared/models/mock-data';
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
  private fb = inject(FormBuilder);
  private dataService = inject(Registration);
  private router = inject(Router);

  constructor() {
    this.methodForm = this.createForm();
  }

  public ngOnInit(): void {
    this.dataService.clearData();
    // Отслеживаем изменения формы
    this.methodForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.dataService.updateData(value);
      })
  }

  private createForm(): FormGroup {
    // Форма с единственным полем, выбора метода (через почту или сторонние сервисы)
    // Возможно излишне, мб поменять попроще
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
    // Переходим к шагу basic если валидна (случаев для невалидности по сути нет, т.к. кнопки нет, но пусть пока будет)
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
    // Переходим сразу к additional, если через соц сети, мб переделать чтоб тоже по сабмиту
    const mockData: RegistrationData = mockUser;

    this.dataService.updateData(mockData);

    this.router.navigate(['/signup', 'additional']);
  }

  private markFormGroupTouched(): void {
    // Помечаем форму, типа взаимодействовали
    Object.keys(this.methodForm.controls).forEach(key => {
      const control = this.methodForm.get(key);
      control?.markAsTouched();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
