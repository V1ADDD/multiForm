import { Component, forwardRef, input, output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { countries } from '../../models/mock-data';
import { Country } from '../../models/registration-types';

@Component({
  selector: 'app-country-select',
  imports: [ReactiveFormsModule],
  templateUrl: './country-select.html',
  styleUrl: './country-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelect),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CountrySelect),
      multi: true
    }
  ]
})
export class CountrySelect implements ControlValueAccessor, Validator {
  public label = input('Страна');
  public id = input('country');
  public errorMessage = input('Выберите страну');
  public required = input(false);
  public countryChange = output<string>();

  public value = '';
  public disabled = false;
  public isInvalid = false;

  public countries: Country[] = countries;

  public onChange = (value: string) => {};
  public onTouched = () => {};
  public onValidatorChange = () => {};

  public onChangeEvent(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.countryChange.emit(value);
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

    this.isInvalid = false;
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private validateControl(): void {
    this.onValidatorChange();
  }
}
