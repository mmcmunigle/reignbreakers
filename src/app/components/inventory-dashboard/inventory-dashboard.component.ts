import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { PlayerCard } from 'src/app/interfaces/player-card';
import { ReignmakerApiService } from 'src/app/services/api.service';

@Component({
  selector: 'inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  inventoryControl = new FormControl();
  cards: PlayerCard[] = [];
  filteredCards: PlayerCard[] = [];
  filteredCardNames?: Observable<any>;
  selectedName?: string;
  cols = "0";
  filters: any = {
    sportsFilter: 'ufc',
    cardTypeFilter: 'all',
    eventFilter: 'all',
    setFilter: 'all',
    sortBy: 'name',
    showCore: true,
    showRare: true,
    showElite: true,
    showLegendary: true,
    showReignmaker: true,

  };
  public menuOpen: boolean = false;

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
    }, 500);

    this.filteredCardNames = this.inventoryControl.valueChanges.pipe(
      debounceTime(200),
      switchMap((value: string) => {
        const matchingCards = this.cards
          .filter(card => {
            return card.name?.toLowerCase()?.includes(value?.toLowerCase());
          });
        const matchingNames = new Set()
        matchingCards.forEach((card: PlayerCard) => matchingNames.add(card.name));
        return of(matchingNames);
      }));
  }
  
  selectName(name: string) {
    this.selectedName = name;
    this.applyFilters();
  }

  openMenu() {
    this.menuOpen = true;
  }

  menuOpenChange(openned: boolean) {
    this.menuOpen = openned;
  }

  setCols() {
    if (window.innerWidth < 1000) {
      this.cols = "1"
    } else if (window.innerWidth < 1600) {
      this.cols = "2"
    }else {
      this.cols = "3";
    }
  }

  applyFilters() {
    switch (this.filters.sportsFilter) {
      case 'ufc':
        this.filteredCards = this.cards.filter((card: any) => card.team === 'UFC');
        break;
      case 'football':
        this.filteredCards = this.cards.filter((card: any) => card.team !== 'UFC');
        break;
      default:
        this.filteredCards = this.cards;
    };

    this.filteredCards = this.filteredCards.filter((card: any) => {
      return this.selectedName ? card.name === this.selectedName : true;
    });

    switch (this.filters.cardTypeFilter) {
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
    };

    this.filteredCards = this.filteredCards.filter((card: any) => {
      return (
        this.filters.showCore && card.rarity.toLowerCase() == 'core' ||
        this.filters.showRare && card.rarity.toLowerCase() == 'rare' ||
        this.filters.showElite && card.rarity.toLowerCase() == 'elite' ||
        this.filters.showLegendary && card.rarity.toLowerCase() == 'legendary' ||
        this.filters.showReignmaker && card.rarity.toLowerCase() == 'reignmaker'
      )
    });

    if (this.filters.eventFilter !== 'all') {
      this.filteredCards = this.filteredCards.filter((card: any) => {
        return (card.event?.name === this.filters.eventFilter);
      })
    }

    if (this.filters.setFilter !== 'all') {
      this.filteredCards = this.filteredCards.filter((card: any) => {
        return (card.set_name === this.filters.setFilter);
      })
    }

    switch(this.filters.sortBy) {
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
    };
  }

  updateFilters(newFilters: any) {
    this.filters = newFilters;
    this.applyFilters();
  }

  sortCards(sortBy: any) {
  }
}
