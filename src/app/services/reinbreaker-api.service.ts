import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReignbreakerApiService {

  // public baseURL: string = `https://flask-service.pqf2epmnql9p2.us-west-2.cs.amazonlightsail.com/api`
  public baseURL: string = `${environment.apiUrl}/api`

  constructor(
    private httpClient: HttpClient
  ) {
    console.log(environment.production);
    console.log(environment.apiUrl);
  }

  getInventory() {
    return this.httpClient
    .get(`${this.baseURL}/ufc-inventory`)
  }

  getUfcEvents() {
    return this.httpClient
    .get(`${this.baseURL}/ufc-events/v2`)
  }

  getUfcMarketData(series: string) {
    return this.httpClient
    .get(`${this.baseURL}/ufc-market-${series}`)
  }

  getRankedFighters() {
    return this.httpClient
    .get(`${this.baseURL}/ranked-fighters`)
  }

  getPgaMaketData() {
    return this.httpClient
    .get(`${this.baseURL}/pga-market`)
  }

  getPgaRankings() {
    return this.httpClient
    .get(`${this.baseURL}/pga-rankings`)
  }

}
