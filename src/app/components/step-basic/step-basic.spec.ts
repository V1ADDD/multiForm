import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBasic } from './step-basic';

describe('StepBasic', () => {
  let component: StepBasic;
  let fixture: ComponentFixture<StepBasic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBasic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBasic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
