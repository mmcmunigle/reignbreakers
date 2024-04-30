import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ReignbreakerApiService } from './reinbreaker-api.service';

const CONTEST_YEARS = ['2023', '2024']

@Injectable({
  providedIn: 'root'
})

export class MarketplaceService implements OnInit {

  private marketplaceData: {
    [key: string]: any,
  }

  constructor(
    public apiService: ReignbreakerApiService,
  ) {}

  ngOnInit(): void {
    CONTEST_YEARS.forEach((year) => {
      this.marketplaceData[year] = this.apiService.getUfcMarketData(year);
    });
  }
}

