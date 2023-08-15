import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoltageComponent } from './voltage.component';

describe('VoltageComponent', () => {
  let component: VoltageComponent;
  let fixture: ComponentFixture<VoltageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoltageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoltageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
