import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepRules } from './step-rules';

describe('StepRules', () => {
  let component: StepRules;
  let fixture: ComponentFixture<StepRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepRules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
