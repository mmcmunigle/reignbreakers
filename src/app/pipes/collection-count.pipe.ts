import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collectionCount'
})
export class CollectionCountPipe implements PipeTransform {

  transform(collection: any[]): number {
    return collection.length
  }

}
