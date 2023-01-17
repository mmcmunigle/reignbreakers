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

  fighterCardsOwned(fighter: string, set_name: string = '') {
    let cards = []
    if (this.collection) {
      cards = this.collection.map((card:any) => card).filter((card: any) => card.name == fighter);
    }
    if (set_name) {
      cards = cards.filter((card: any) => card.set_name == set_name);
    }
    return cards
  }
}
