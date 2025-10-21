import { Component, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { input } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-custom-input',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomInput),
      multi: true
    },
    provideNgxMask()
  ]
})
export class CustomInput implements ControlValueAccessor, Validator {
  public label = input('');
  public type = input('text');
  public id = input('');
  public placeholder = input('');
  public errorMessage = input('');
  public required = input(false);
  public minLength = input<number>();
  public pattern = input<string>(); 

  public value = '';
  public disabled = false;
  public isInvalid = false;

  private onChange = (value: string) => {};
  public onTouched = () => {};
  private onValidatorChange = () => {};

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.validateControl();
  }

  public writeValue(value: string): void {
    this.value = value || '';
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (this.required() && !value) {
      this.isInvalid = true;
      return { required: true };
    }

    if (value && this.minLength() && value.length < <number>this.minLength()) {
      this.isInvalid = true;
      return {
        minLength: {
          requiredLength: this.minLength,
          actualLength: value.length
        }
      };
    }

    if (value && this.pattern() && !new RegExp(<string>this.pattern()).test(value)) {
      this.isInvalid = true;
      return { pattern: true };
    }

    this.isInvalid = false;
    return null;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private validateControl(): void {
    this.onValidatorChange();
  }
}
