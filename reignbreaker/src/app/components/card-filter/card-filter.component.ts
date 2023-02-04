import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReignmakerApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.scss']
})
export class CardFilterComponent implements OnInit {
  @Output() cardFilterChange = new EventEmitter<any>();
  public events: string[] = [];
  public sportsFilter?: string = 'all';
  public cardTypeFilter?: string = 'all';
  public sortBy: string = 'name';
  public setFilter: string = 'all';
  public showCore = true;
  public showRare = true;
  public showElite = true;
  public showLegendary = true;
  public showReignmaker = true;
  public eventFilter = 'all';

  constructor(
    public apiService: ReignmakerApiService,
  ) { }

  ngOnInit(): void {
    this.apiService.getUfcEvents()
    .subscribe((events: any) => {
      events.forEach((event: any) => {
        this.events.push(event.name)
      });
    });
  }

  setCore(selected: boolean) {
    this.showCore = selected;
  }

  setSportsSelector(selected: boolean, selection: string) {
    if (selected) {
      this.sportsFilter = selection;
    }
    this.updateFilters();
  }

  setCardTypeFilter(selected: boolean, selection: string) {
    if (selected) {
      this.cardTypeFilter = selection;
    }
    this.updateFilters();
  }

  setEventFilter(selected: boolean, selection: string) {
    if (selected) {
      this.cardTypeFilter = selection;
    }
    this.updateFilters();
  }

  setSort(sortBy: any) {
    this.sortBy = sortBy;
    this.updateFilters();
  }

  setEvent(event: any) {
    this.eventFilter = event;
    this.updateFilters();
  }

  setSetFilter(setName: any) {
    this.setFilter = setName;
    this.updateFilters();
  }

  updateFilters() {
    this.cardFilterChange.emit({
      sportsFilter: this.sportsFilter,
      cardTypeFilter: this.cardTypeFilter,
      eventFilter: this.eventFilter,
      setFilter: this.setFilter,
      sortBy: this.sortBy,
      showCore: this.showCore,
      showRare: this.showRare,
      showElite: this.showElite,
      showLegendary: this.showLegendary,
      showReignmaker: this.showReignmaker
    });
  }

}
