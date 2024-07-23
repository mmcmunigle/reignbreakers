import { Component, OnInit } from '@angular/core';
import { CollectionType } from 'src/app/enums/collection-type';
import { ReignbreakerApiService } from 'src/app/services/reinbreaker-api.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  public collectionTypes = Object.keys(CollectionType);
  public selectedCollection: CollectionType = CollectionType.UFC_2024;
  public tableView: boolean = true;
  public filteredCollection: any;
  public initialized: boolean = false;
  private collection: any;

  constructor(private apiService: ReignbreakerApiService) { }

  ngOnInit(): void {
    this.apiService.getInventory()
    .subscribe((cards: any) => {
      this.collection = cards;
      this.filteredCollection = cards.filter((x: any) => x.collection == this.selectedCollection);
      this.initialized = true;
    })
  }

  setCollection(target: string) {
    const result = CollectionType[target as keyof typeof CollectionType];
    this.selectedCollection = result;
    if (result === CollectionType.ALL) {
      this.filteredCollection = this.collection;
    }
    else if (result === CollectionType.OTHER) {
      this.filteredCollection = this.collection.filter((x:any) => !Object.values(CollectionType).includes(x.collection))
    }
     else {
      this.filteredCollection = this.collection.filter((x: any) => x.collection == result);
    }
  }
}
