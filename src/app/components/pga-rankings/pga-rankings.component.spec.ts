import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgaRankingsComponent } from './pga-rankings.component';

describe('PgaRankingsComponent', () => {
  let component: PgaRankingsComponent;
  let fixture: ComponentFixture<PgaRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgaRankingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgaRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
