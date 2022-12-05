import { Component, OnInit } from '@angular/core';
import { ReignmakerApiService } from 'src/app/services/api.service';

@Component({
  selector: 'inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  cards: any = [];
  filteredCards: any = [];
  typeFilter?: string = 'all';
  sortBySelection: string = 'name';

  constructor(
    public apiService: ReignmakerApiService,
  ) {}

  ngOnInit(): void {
    this.apiService.getInventory()
    .subscribe((cards) => {
      this.cards = cards;
      this.filteredCards = cards;
      this.sortCards('name');
    })
  }

  toggleAll(selected: boolean) {
    if (selected) {
      this.typeFilter = 'all';
      this.filteredCards = this.cards;
    }
  }

  toggleUfc(selected: boolean): void {
    if (selected) {
      this.typeFilter = 'ufc';
      this.filteredCards = this.cards.filter((card: any) => card.team === 'UFC');
    }
  }

  toggleFootball(selected: boolean): void {
      if (selected) {
        this.typeFilter = 'football';
        this.filteredCards = this.cards.filter((card: any) => card.team !== 'UFC');
      }
  }

  sortCards(sortBy: any) {
      switch(sortBy) {
          case 'name':
            this.filteredCards.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1);
            break;
          case 'purchase':
            this.filteredCards.sort((a: any, b: any) => (a.pp < b.pp) ? 1 : -1);
            break;
          case 'diff':
            this.filteredCards.sort((a: any, b: any) => (a.diff < b.diff) ? 1 : -1);
            break;
      }
  }
}
