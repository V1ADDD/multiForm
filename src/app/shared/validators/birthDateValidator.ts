import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { emailPattern, namePattern } from "../models/mock-data";

export function birthDateValidator(form: AbstractControl): ValidationErrors | null {
    const birthDate = form.get('birthDate')?.value;
    const parentName = form.get('parentName');
    const parentEmail = form.get('parentEmail');

    if (!birthDate) return null;

    const isMinor = getAge(new Date(birthDate)) < 18;

    if (isMinor) {
        parentName?.setValidators([
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(namePattern),
        ]);
        parentEmail?.setValidators([
            Validators.required,
            Validators.pattern(emailPattern),
        ]);
    } else {
        parentName?.clearValidators();
        parentEmail?.clearValidators();
    }
    return null;
}

export function getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
}