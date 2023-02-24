import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReignmakerApiService {

  // public baseURL: string = `https://flask-service.pqf2epmnql9p2.us-west-2.cs.amazonlightsail.com/api`
  public baseURL: string = `http://localhost:5000/api`

  constructor(
    private httpClient: HttpClient
  ) {}

  getInventory() {
    return this.httpClient
    .get(`${this.baseURL}/inventory`)
  }

  getUfcEvents() {
    return this.httpClient
    .get(`${this.baseURL}/ufc_events`)
  }

  getUfcMarketData() {
    return this.httpClient
    .get(`${this.baseURL}/ufc_market`)
  }

  getRankedFighters() {
    return this.httpClient
    .get(`${this.baseURL}/ranked_fighters`)
  }
}
