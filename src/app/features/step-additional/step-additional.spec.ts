import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAdditional } from './step-additional';

describe('StepAdditional', () => {
  let component: StepAdditional;
  let fixture: ComponentFixture<StepAdditional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAdditional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAdditional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
