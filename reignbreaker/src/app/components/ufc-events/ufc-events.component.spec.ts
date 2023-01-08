import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UfcEventsComponent } from './ufc-events.component';

describe('UfcEventsComponent', () => {
  let component: UfcEventsComponent;
  let fixture: ComponentFixture<UfcEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UfcEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UfcEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
