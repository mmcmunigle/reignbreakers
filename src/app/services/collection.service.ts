import { Injectable, OnInit } from '@angular/core';
import { ReignbreakerApiService } from './reinbreaker-api.service';
import { CollectionType } from '../enums/collection-type';

@Injectable({
  providedIn: 'root'
})
export class CollectionService implements OnInit {

  private collection: any;

  constructor(
    public apiService: ReignbreakerApiService,
  ) {
    this.apiService.getInventory()
      .subscribe((cards: any) => {
        this.collection = cards;
      });
  }

  ngOnInit(): void {
    this.collection = this.apiService.getInventory();
  }

  fighterCardsOwned(fighter: string, collection: CollectionType, set_name: string = '') {
    let cards = []
    if (!this.collection) return [];

    cards = this.collection.map((card: any) => card).filter((card: any) => {
      return (card.name.toLowerCase() === fighter.toLowerCase()
        && card.collection == collection)
    });

    if (set_name) {
      cards = cards.filter((card: any) => card.set_name == set_name);
    }

    return cards
  }
}
