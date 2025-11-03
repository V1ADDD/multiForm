import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { countries, genders } from '../../models/mock-data';
import { LowerCasePipe } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [LowerCasePipe, NgxMaskDirective, FormsModule],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss',
  providers: [
    
    provideNgxMask(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>CustomInput),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomInput implements ControlValueAccessor {
  public value: string | boolean = '';

  public label = input<string>();
  public name = input<string>();
  public type = input<string>();
  public errorMes = input<string>();
  public invalid = input<boolean>();
  public inputMask = input<string>();
  public min = input<string>();
  public max = input<string>();
  public required = input<boolean>();

  public countries = countries;
  public genders = genders;

  public onChange: ((value: string | boolean) => void) | null = null;
  public onTouched: (() => void) | null = null;

  public onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = this.type() === 'checkbox' ? target.checked : target.value;
    this.value = value;
    this.onChange?.(value);
  }

  public writeValue(value: string): void {
    if (this.type() === 'checkbox') {
      const boolValue = !!value;
      this.value = boolValue;
    } else {      
      this.value = value || '';
    }
  }

  public registerOnChange(fn: (value: string | boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
