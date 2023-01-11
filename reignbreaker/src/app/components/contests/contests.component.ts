import { Component, OnInit } from '@angular/core';
import { ReignmakerApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.scss']
})
export class ContestsComponent implements OnInit {
  rankedFighters: any;
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

    this.apiService.getRankedFighters()
    .subscribe((fighters: any) => {
      this.rankedFighters = fighters;
    });
  }
}
