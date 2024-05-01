import { Component, OnInit } from '@angular/core';
import { ReignbreakerApiService } from 'src/app/services/reinbreaker-api.service';

@Component({
  selector: 'app-pga-rankings',
  templateUrl: './pga-rankings.component.html',
  styleUrls: ['./pga-rankings.component.scss']
})
export class PgaRankingsComponent implements OnInit {

  rankings: any;
  market: any;
  constructor(public apiService: ReignbreakerApiService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.apiService.getPgaMaketData()
      .subscribe((market: any) => {
        this.market = market;
      });
    }, 3000)

    this.apiService.getPgaMaketData()
    .subscribe((market: any) => {
      this.market = market;
    });

    this.apiService.getPgaRankings()
    .subscribe((events: any) => {
      this.rankings = events;
    });
  }

}
