import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFighterComponent } from './event-fighter.component';

describe('EventFighterComponent', () => {
  let component: EventFighterComponent;
  let fixture: ComponentFixture<EventFighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventFighterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
