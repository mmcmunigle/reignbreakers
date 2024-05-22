import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collectionValue'
})
export class CollectionValuePipe implements PipeTransform {

  transform(collection: any[]): string {
    const marketValue = collection.reduce((value: number, card) => {
      if (card.offer && card.offer > (card.market / 2)) {
        return value + (card.market + card.offer) / 2
      } else {
        return value + card.market * .50
      }
    }, 0.0)
    return marketValue.toFixed(0)
  }

}
