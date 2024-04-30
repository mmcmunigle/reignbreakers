import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReignmakerApiService } from 'src/app/services/reinbreaker-api.service';

@Component({
  selector: 'app-ufc-events',
  templateUrl: './ufc-events.component.html',
  styleUrls: ['./ufc-events.component.scss']
})
export class UfcEventsComponent implements OnInit {

  events: any;
  merchandise: any;
  selectedYear: string = '2024';

  constructor(public apiService: ReignmakerApiService, private changeRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    setInterval(() => {
      this.apiService.getUfcMarketData(this.selectedYear)
      .subscribe((merchandise: any) => {
        this.merchandise = merchandise;
      });
    }, 30000)

    this.apiService.getUfcMarketData(this.selectedYear)
    .subscribe((merchandise: any) => {
      this.merchandise = merchandise;
    });

    this.apiService.getUfcEvents()
    .subscribe((events: any) => {
      this.events = events;
    });
  }

  yearSelected(): void {
    this.apiService.getUfcMarketData(this.selectedYear)
    .subscribe((merchandise: any) => {
      this.merchandise = merchandise;
      this.changeRef.detectChanges()
      This does not work - need to make a merchandise manager or include with the fighters
    });
  }

}
