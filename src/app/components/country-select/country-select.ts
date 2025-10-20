import { Component, forwardRef, input, output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';

type Country = {
  code: string;
  name: string;
  phoneCode: string;
}

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

  public countries: Country[] = [
    { code: 'by', name: 'Беларусь', phoneCode: '+375' },
    { code: 'ru', name: 'Россия', phoneCode: '+7' },
    { code: 'us', name: 'США', phoneCode: '+1' },
    { code: 'de', name: 'Германия', phoneCode: '+49' },
    { code: 'fr', name: 'Франция', phoneCode: '+33' },
    { code: 'it', name: 'Италия', phoneCode: '+39' },
    { code: 'es', name: 'Испания', phoneCode: '+34' },
    { code: 'jp', name: 'Япония', phoneCode: '+81' },
    { code: 'cn', name: 'Китай', phoneCode: '+86' }
  ];

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
