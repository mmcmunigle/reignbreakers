import { Component, OnInit } from '@angular/core';
import { PlayerCard } from 'src/app/interfaces/player-card';
import { ReignmakerApiService } from 'src/app/services/api.service';

@Component({
  selector: 'inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  cards: PlayerCard[] = [];
  filteredCards: PlayerCard[] = [];
  sportsFilter?: string = 'all';
  cardTypeFilter?: string = 'all';
  sortBySelection: string = 'name';
  showCore = true;
  showRare = true;
  showElite = true;
  showLegendary = true;
  showReignmaker = true;
  cols = "0";

  constructor(
    public apiService: ReignmakerApiService,
  ) {}

  ngOnInit(): void {
    this.apiService.getInventory()
    .subscribe((cards: any) => {
      this.cards = cards;
      this.applyFilters();
      this.sortCards('name');
      this.setCols();
    })

    setInterval(() => {
      this.setCols();
    }, 1000);
  }

  setCols() {
    if (window.innerWidth < 1200) {
      this.cols = "1"
    } else {
      this.cols = "2";
    }
  }

  setSportsSelector(selected: boolean, selection: string) {
    if (selected) {
      this.sportsFilter = selection;
      this.applyFilters()
    }
  }

  setCardTypeFilter(selected: boolean, selection: string) {
    if (selected) {
      this.cardTypeFilter = selection;
      this.applyFilters()
    }
  }

  applyFilters() {
    switch (this.sportsFilter) {
      case 'ufc':
        this.filteredCards = this.cards.filter((card: any) => card.team === 'UFC');
        break;
      case 'football':
        this.filteredCards = this.cards.filter((card: any) => card.team !== 'UFC');
        break;
      default:
        this.filteredCards = this.cards;
    }

    switch (this.cardTypeFilter) {
      case 'passes':
        this.filteredCards = this.filteredCards.filter((card: any) => card.name.includes('Pass'));
        break;
      case 'packs':
        this.filteredCards = this.filteredCards.filter((card: any) => card.name.includes('Pack'));
        break;
      case 'players':
        this.filteredCards = this.filteredCards.filter((card: any) => !card.name.includes('Pass'));
        break;
      default:
        this.filteredCards = this.filteredCards;
    }

    this.filteredCards = this.filteredCards.filter((card: any) => {
      return (
        this.showCore && card.rarity.toLowerCase() == 'core' ||
        this.showRare && card.rarity.toLowerCase() == 'rare' ||
        this.showElite && card.rarity.toLowerCase() == 'elite' ||
        this.showLegendary && card.rarity.toLowerCase() == 'legendary' ||
        this.showReignmaker && card.rarity.toLowerCase() == 'reignmaker'
      )
      
    })
      
  }

  sortCards(sortBy: any) {
      switch(sortBy) {
          case 'name':
            this.filteredCards.sort((a: any, b: any) => (a.name > b.name) ? -1 : 1);
            break;
          case 'purchase':
            this.filteredCards.sort((a: any, b: any) => (a.pp < b.pp) ? 1 : -1);
            break;
          case 'market':
            this.filteredCards.sort((a: any, b: any) => (a.lp < b.lp) ? 1 : -1);
            break;
          case 'list':
            this.filteredCards.sort((a: any, b: any) => (a.sale < b.sale) ? 1 : -1);
            break;
          case 'diff':
            this.filteredCards.sort((a: any, b: any) => (a.diff < b.diff) ? 1 : -1);
            break;
      }
  }
}
