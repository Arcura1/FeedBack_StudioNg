import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterparameterComponent } from './registerparameter.component';

describe('RegisterparameterComponent', () => {
  let component: RegisterparameterComponent;
  let fixture: ComponentFixture<RegisterparameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterparameterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterparameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
