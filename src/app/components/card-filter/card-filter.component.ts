import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReignmakerApiService } from 'src/app/services/reinbreaker-api.service';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.scss']
})
export class CardFilterComponent implements OnInit {
  @Output() cardFilterChange = new EventEmitter<any>();
  @Output() closeClicked = new EventEmitter<null>();
  public events: string[] = [];
  public sportsFilter?: string = 'all';
  public cardTypeFilter?: string = 'all';
  public sortBy: string;
  public setFilter: string;
  public eventFilter:string;
  public showCore = true;
  public showRare = true;
  public showElite = true;
  public showLegendary = true;
  public showReignmaker = true;

  constructor(
    private apiService: ReignmakerApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sortBy = this.activatedRoute.snapshot.queryParams.sort || 'name-up';
    this.eventFilter = this.activatedRoute.snapshot.queryParams.event || 'all';
    this.setFilter = this.activatedRoute.snapshot.queryParams.set || 'all';
    this.updateFilters();
    this.apiService.getUfcEvents()
    .subscribe((events: any) => {
      events.forEach((event: any) => {
        this.events.push(event.title)
      });
    });
  }

  close() {
    this.closeClicked.emit();
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


  setSort(sortBy: any) {
    this.sortBy = sortBy;
    this.updateFilters();
    this.updateQueryParams({'sort': this.sortBy});
  }

  setEvent(event: any) {
    this.eventFilter = event;
    this.updateFilters();
    this.updateQueryParams({'event': this.eventFilter});
  }

  setSetFilter(setName: any) {
    this.setFilter = setName;
    this.updateFilters();
    this.updateQueryParams({'set': this.setFilter});
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

  public updateQueryParams(param: object) {
    const queryParams: Params = param;
  
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
  }

}
