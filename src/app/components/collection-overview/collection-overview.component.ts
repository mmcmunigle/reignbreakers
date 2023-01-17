import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss']
})
export class CollectionOverviewComponent implements OnChanges {
  @Input() collection: any
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
