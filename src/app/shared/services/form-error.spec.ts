import { TestBed } from '@angular/core/testing';

import { FormError } from './form-error';

describe('FormError', () => {
  let service: FormError;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormError);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
