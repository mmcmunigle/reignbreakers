import { Injectable, OnInit } from '@angular/core';
import { ReignmakerApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService implements OnInit {
  private collection: any;
  constructor(
    public apiService: ReignmakerApiService,
  ) {
    this.apiService.getInventory()
      .subscribe((cards: any) => {
        this.collection = cards;
      });
  }

  ngOnInit(): void {
    this.collection = this.apiService.getInventory();
  }

  fighterCardsOwned(fighter: string) {
    const cards = this.collection.filter((card: any) => card.name == fighter);
    return cards
  }
}
