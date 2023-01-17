import { Component, OnInit } from '@angular/core';
import { ReignmakerApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ufc-events',
  templateUrl: './ufc-events.component.html',
  styleUrls: ['./ufc-events.component.scss']
})
export class UfcEventsComponent implements OnInit {

  events: any;
  merchandise: any;
  constructor(public apiService: ReignmakerApiService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.apiService.getUfcMarketData()
      .subscribe((merchandise: any) => {
        this.merchandise = merchandise;
      });
    }, 30000)

    this.apiService.getUfcMarketData()
    .subscribe((merchandise: any) => {
      this.merchandise = merchandise;
    });

    this.apiService.getUfcEvents()
    .subscribe((events: any) => {
      this.events = events;
    });
  }

}
