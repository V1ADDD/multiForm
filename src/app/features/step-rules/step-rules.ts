import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { formErrors } from '../../shared/models/errors';
import { Location } from '@angular/common';
import { BaseFormStep } from '../../shared/component-bases/base-form-step';

@Component({
  selector: 'app-step-rules',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './step-rules.html',
  styleUrl: './step-rules.scss'
})
export class StepRules extends BaseFormStep implements OnInit, OnDestroy {
  public override form: FormGroup;

  private fb = inject(FormBuilder);
  private location = inject(Location);
  private errors = formErrors;

  constructor() {
    super();
    this.form = this.createForm();
  }

  public ngOnInit(): void {
    const currentData = this.dataService.getCurrentData();
    if (!currentData.method) this.router.navigate(['/signup', 'method']);
    if (!currentData.additionalInfo?.valid || !currentData.basicInfo?.valid) this.location.back();
    
    if (currentData.confirmation) {
      setTimeout(()=>this.form.patchValue({...currentData.confirmation}));
    }

    this.subscribeToFormChanges('confirmation');
  }

  private createForm(): FormGroup {
    return this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
      acceptPrivacy: [false, Validators.requiredTrue],
      subscribe: [false]
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dataService.updateData({ confirmation: this.form.value });
      this.router.navigate(['/signup', 'rules']);
    } else {
      this.markFormGroupTouched();
    }
  }

  public goBack(): void {
    this.router.navigate(['/signup', 'additional']);
  }
}
