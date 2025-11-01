import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { takeUntil } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { DateValidators } from '../../shared/models/date-validators';
import { BaseFormStep } from '../../shared/component-bases/base-form-step';
import { emailPattern, namePattern } from '../../shared/models/mock-data';

@Component({
  selector: 'app-step-additional',
  imports: [ReactiveFormsModule, CustomInput, DatePipe],
  templateUrl: './step-additional.html',
  styleUrl: './step-additional.scss'
})
export class StepAdditional extends BaseFormStep implements OnInit, OnDestroy {
  public override form: FormGroup;
  public showParentFields = false;
  public minDate = '1900-01-01';
  public maxDate = new Date();

  private fb = inject(FormBuilder);
  private location = inject(Location);

  constructor() {
    super();
    this.form = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();

    // Возврат к другой странице, если не тот метод или невалидность предыдущих форм
    if (!currentData.method) this.router.navigate(['/signup', 'method']);
    if (!currentData.basicInfo?.valid) this.location.back();
    
    if (currentData.additionalInfo) {
      setTimeout(()=>this.form.patchValue({...currentData.additionalInfo}));
      if (currentData.additionalInfo.birthDate && 
          this.getAge(new Date(currentData.additionalInfo.birthDate)) < 18) 
      {
        this.showParentFields = true;
      }
    }

    this.dataService.updateData({ additionalInfo: { ...this.form.value, valid: false } });

    this.subscribeToFormChanges('additional');

    this.form.get('birthDate')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(birthDate => {
        if (!this.form.get('birthDate')?.invalid) {
          this.showParentFields = this.getAge(new Date(birthDate)) < 18;
          const parentName = this.form.get('parentName');
          const parentEmail = this.form.get('parentEmail');
          if (!this.showParentFields) {
            this.form.patchValue({ parentName: '', parentEmail: '' });
            parentName?.clearValidators();
            parentEmail?.clearValidators();
          } else {
            parentName?.setValidators([Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]);
            parentEmail?.setValidators([Validators.required, Validators.pattern(emailPattern)]);
          }
          parentName?.updateValueAndValidity();
          parentEmail?.updateValueAndValidity();
        }
    })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      addressCountry: ['', Validators.required],
      addressCity: ['', Validators.required],
      addressStreet: ['', Validators.required],
      birthDate: ['', [Validators.required, DateValidators.minDate(this.minDate), DateValidators.maxDate(this.maxDate.toString())]],
      gender: ['', Validators.required],
      parentName: [''],
      parentEmail: ['']
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dataService.updateData({ additionalInfo: { ...this.form.value, valid: true } });
      this.router.navigate(['/signup', 'rules']);
    } else {
      this.markFormGroupTouched();
    }
  }
  
  public goBack(): void {
    this.router.navigate(['/signup', 'basic']);
  }

  public getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
