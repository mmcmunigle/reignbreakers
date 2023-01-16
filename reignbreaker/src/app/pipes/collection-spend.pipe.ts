import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collectionSpend'
})
export class CollectionSpendPipe implements PipeTransform {

  transform(collection: any[]): number {
    return (collection.reduce((spend, card) => spend += card.purchase, 0)).toFixed(1)
  }

}
