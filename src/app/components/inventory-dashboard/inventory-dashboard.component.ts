import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { PlayerCard } from 'src/app/interfaces/player-card';
import { ReignbreakerApiService } from 'src/app/services/reinbreaker-api.service';

@Component({
  selector: 'inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  public cols = "0";
  public menuOpen: boolean = false;
  public nameControl = new FormControl();
  public cards: PlayerCard[] = [];
  public filteredCards: PlayerCard[] = [];
  public names: string[] = [];
  public filteredCardNames?: Observable<any>;
  public filterOpened: boolean = false;
  public selectedNames: string[] = []; 

  private filters: any = {
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

  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  constructor(
    private apiService: ReignbreakerApiService,
  ) {}

  ngOnInit(): void {
    this.apiService.getInventory()
    .subscribe((cards: any) => {
      this.cards = cards;
      this.apiService.getUfcMarketData('2024')
        .subscribe((market: any) => {
          this.mergeMarketData(market);
          this.applyFilters();
          this.setCols();
        })
    })

    setInterval(() => {
      this.setCols();
    }, 250);

    this.filteredCardNames = this.nameControl.valueChanges.pipe(
      debounceTime(250),
      switchMap((value: string) => {
        const matches = this.names
          .filter(name => {
            return name?.toLowerCase()?.includes(value?.toLowerCase());
          });
        
        const matchingNames = new Set()
        matches.forEach((name) => matchingNames.add(name));
        return of(matchingNames);
      }
    ));
  }

  private mergeMarketData(market: any) {
    this.cards.forEach((card) => {
      if (market[card.name]) {
        const marketData = market[card.name][card.rarity][card.set_name];
        card.market = marketData ? marketData.price : 0;
      } else {
        card.market = 0;
      }
    });
  }
  
  public nameSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedNames.push(event.option.viewValue);
    this.nameInput.nativeElement.value = '';
    this.nameControl.setValue(null);
    this.applyFilters();
  }

  public addName(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.names?.includes(value)) {
      this.selectedNames.push(value);
      this.applyFilters();
    }

    event.chipInput!.clear();
    this.nameControl.setValue(null);
  }


  public removeName(name: string): void {
    const index = this.selectedNames.indexOf(name);

    if (index >= 0) {
      this.selectedNames.splice(index, 1);
      this.applyFilters();
    }
  }

  private setCols() {
    if (window.innerWidth < 1000) {
      this.cols = "1"
    } else if (window.innerWidth < 1600) {
      this.cols = "2"
    }else {
      this.cols = "3";
    }
  }

  public closeFilters() {
    this.filterOpened = false;
  }

  private applyFilters() {
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
      return this.selectedNames.length ? this.selectedNames.includes(card.name) : true;
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
      case 'name-up':
        this.filteredCards.sort((a: any, b: any) => (a.name < b.name) ? -1 : 1);
        break;
      case 'name-down':
        this.filteredCards.sort((a: any, b: any) => (a.name > b.name) ? -1 : 1);
        break;
      case 'purchase-up':
        this.filteredCards.sort((a: any, b: any) => (a.purchase < b.purchase) ? 1 : -1);
        break;
      case 'purchase-down':
        this.filteredCards.sort((a: any, b: any) => (a.purchase > b.purchase) ? 1 : -1);
        break;
      case 'market-up':
        this.filteredCards.sort((a: any, b: any) => (a.market < b.market) ? 1 : -1);
        break;
      case 'market-down':
        this.filteredCards.sort((a: any, b: any) => (a.market > b.market) ? 1 : -1);
        break;
      case 'list-up':
        this.filteredCards.sort((a: any, b: any) => (a.sale < b.sale) ? 1 : -1);
        break;
      case 'list-down':
        this.filteredCards.sort((a: any, b: any) => (a.sale > b.sale) ? 1 : -1);
        break;
      case 'diff-up':
        this.filteredCards.sort((a: any, b: any) => (a.diff < b.diff) ? 1 : -1);
        break;
      case 'diff-down':
        this.filteredCards.sort((a: any, b: any) => (a.diff > b.diff) ? 1 : -1);
        break;
    };

    this.names = this.cards.map(card => card.name);
  }

  updateFilters(newFilters: any) {
    this.filters = newFilters;
    this.applyFilters();
  }

}
