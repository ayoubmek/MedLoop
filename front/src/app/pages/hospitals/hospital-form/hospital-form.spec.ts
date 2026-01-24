import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalForm } from './hospital-form';

describe('HospitalForm', () => {
  let component: HospitalForm;
  let fixture: ComponentFixture<HospitalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
