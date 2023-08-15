import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifieEmailComponent } from './verifie-email.component';

describe('VerifieEmailComponent', () => {
  let component: VerifieEmailComponent;
  let fixture: ComponentFixture<VerifieEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifieEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifieEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
