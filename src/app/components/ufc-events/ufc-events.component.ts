import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ReignbreakerApiService } from 'src/app/services/reinbreaker-api.service';

@Component({
  selector: 'app-ufc-events',
  templateUrl: './ufc-events.component.html',
  styleUrls: ['./ufc-events.component.scss']
})
export class UfcEventsComponent implements OnInit {

  public events: any;
  public selectedYear: string = '2024';
  public columnSize: number = 2;

  constructor(public apiService: ReignbreakerApiService, private responsive: BreakpointObserver) { }

  ngOnInit(): void {
    this.apiService.getUfcEvents()
    .subscribe((events: any) => {
      this.events = events;
    });

    this.responsive.observe([
      Breakpoints.TabletPortrait,
      Breakpoints.HandsetPortrait,
      Breakpoints.Medium,
      Breakpoints.Small])
      .subscribe(result => {
    
        const breakpoints = result.breakpoints;
    
        if (breakpoints[Breakpoints.TabletPortrait]) {
          this.columnSize = 1;
        }
        else if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.columnSize = 1;
        }
        else if (breakpoints[Breakpoints.Medium]) {
          this.columnSize = 1;
        }
        else if (breakpoints[Breakpoints.Small]) {
          this.columnSize = 1;
        }
        else {
          this.columnSize = 2;
        }
    
      });
  }
}
