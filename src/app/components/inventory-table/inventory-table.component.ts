import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {AfterViewInit, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  } from 'src/app/services/reinbreaker-api.service';


@Component({
  selector: 'inventory-table',
  styleUrls: ['./inventory-table.component.scss'],
  templateUrl: './inventory-table.component.html',
})

export class InventoryTableComponent implements AfterViewInit {
  @Input() collection: any;
  @Output() cardsFiltered = new EventEmitter<any>();

  private defaultColumns = ['name', 'set', 'rarity', 'event', 'market', 'offer', 'sale'];
  private mobileColumns = ['name', 'rarity', 'event', 'market', 'offer', 'sale'];
  public displayedColumns = this.defaultColumns;

  public dataSource: MatTableDataSource<Collectable>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private responsive: BreakpointObserver) {}

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.collection);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.responsive.observe([
      Breakpoints.TabletPortrait,
      Breakpoints.HandsetPortrait,
      Breakpoints.Medium,
      Breakpoints.Small])
      .subscribe(result => {

        const breakpoints = result.breakpoints;

        if (breakpoints[Breakpoints.TabletPortrait]) {
          this.displayedColumns = this.mobileColumns;
        }
        else if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.displayedColumns = this.mobileColumns;
        }
        else if (breakpoints[Breakpoints.Medium]) {
          this.displayedColumns = this.mobileColumns;
        }
        else if (breakpoints[Breakpoints.Small]) {
          this.displayedColumns = this.mobileColumns;
        }
        else {
          this.displayedColumns = this.defaultColumns;
        }
    
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.collection);
    this.dataSource.data = changes.collection.currentValue;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(target: any) {
    let filterValue = target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    this.cardsFiltered.emit(this.dataSource.filteredData)
  }
}

export interface Collectable {
  name: string;
  collection: string;
  event: string;
  edition: number;
  link: string;
  rarity: string;
  market: number;
  offer: number;
  sale: number;
  set_name: string;
  useable_all_season: boolean;
}