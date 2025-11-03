import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { socialsGuard } from './socials-guard';

describe('socialsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => socialsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
