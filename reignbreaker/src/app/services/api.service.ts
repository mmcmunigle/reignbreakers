import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReignmakerApiService {

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
}
