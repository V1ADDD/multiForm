import { Component, forwardRef, input } from '@angular/core';
import { countries } from '../../models/mock-data';
import { LowerCasePipe } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [LowerCasePipe, NgxMaskDirective],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>CustomInput),
      multi: true
    },
    provideNgxMask()
  ]
})
export class CustomInput implements ControlValueAccessor {
  public value = '';

  public label = input<string>();
  public name = input<string>();
  public type = input<string>();
  public errorMes = input<string>();
  public invalid = input<boolean>();
  public inputMask = input<string>();

  public countries = countries;

  public onChange: ((value: string) => void) | null = null;
  public onTouched: (() => void) | null = null;

  public onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange?.(value);
    this.onTouched?.();
  }

  public writeValue(value: string): void {
    this.value = value || '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
