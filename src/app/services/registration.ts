import { Injectable } from '@angular/core';
import { RegistrationData } from '../models/registration-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Registration {
  private readonly STORAGE_KEY = 'registration_data';

  private data: RegistrationData = {};
  private dataSubject = new BehaviorSubject<RegistrationData>(this.loadFromStorage());

  public data$ = this.dataSubject.asObservable();

  public updateData(updates: Partial<RegistrationData>): void {
    this.data = { ...this.data, ...updates };
    this.saveToStorage();
    this.dataSubject.next(this.data);
  }

  public getCurrentData(): RegistrationData {
    return { ...this.data };
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  private loadFromStorage(): RegistrationData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  public clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.data = {};
    this.dataSubject.next(this.data);
  }
}
