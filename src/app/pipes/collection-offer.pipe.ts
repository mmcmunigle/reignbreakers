import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collectionOffer'
})
export class CollectionOfferPipe implements PipeTransform {

  transform(collection: any[]): string {
    return (collection.reduce((offer, card) => offer += card.offer, 0)).toFixed(0)
  }

}
