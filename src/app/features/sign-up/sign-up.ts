import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mockUser } from '../../shared/models/mock-data';
import { Router } from '@angular/router';
import { Registration } from '../../shared/services/registration';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp implements OnInit {
  public form!: FormGroup;
  private fb = inject(FormBuilder);

  private destroyRef = inject(DestroyRef);
  private dataService = inject(Registration);
  private router = inject(Router);

  public ngOnInit(): void {
    this.form = this.fb.group({
      method: ['', Validators.required]
    });
    this.dataService.clearData();
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500)
    ).subscribe(value => this.dataService.updateData(value));
  }

  public selectMethod(method: 'email' | 'social'): void {
    this.form?.patchValue({
      method
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      if (this.form.get('method')?.value === 'email') {
        this.dataService.updateData(this.form.value);
        this.router.navigate(['/signup', 'basic']);
      }
      else {
        this.dataService.updateData(mockUser);
        this.router.navigate(['/signup', 'additional']);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
