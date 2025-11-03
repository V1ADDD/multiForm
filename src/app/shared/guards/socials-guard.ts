import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Registration } from "../services/registration";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class socialsGuard implements CanActivate {
  private readonly registrationService = inject(Registration);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentData = this.registrationService.getCurrentData();
    if (currentData.method !== 'social') {
      return this.router.navigateByUrl('signup/email/basic');
    }
    return true;
  }
}