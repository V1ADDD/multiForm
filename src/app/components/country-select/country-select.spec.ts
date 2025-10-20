import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrySelect } from './country-select';

describe('CountrySelect', () => {
  let component: CountrySelect;
  let fixture: ComponentFixture<CountrySelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountrySelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountrySelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
