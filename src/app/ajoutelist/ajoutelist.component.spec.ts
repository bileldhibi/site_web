import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutelistComponent } from './ajoutelist.component';

describe('AjoutelistComponent', () => {
  let component: AjoutelistComponent;
  let fixture: ComponentFixture<AjoutelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
