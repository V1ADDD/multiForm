import { Injectable, inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Registration } from '../services/registration';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FormValidateGuard implements CanActivate {
  private registrationService = inject(Registration);
  private location = inject(Location);

  canActivate(): boolean {
    const isPreviousFormValid = this.registrationService.isPreviousStepValid();
    if (!isPreviousFormValid) {
      this.location.back();
      return false;
    }
    return true;
  }
}