import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import {CollectionType} from 'src/app/enums/collection-type';

@Component({
  selector: 'app-event-fighter',
  templateUrl: './event-fighter.component.html',
  styleUrls: ['./event-fighter.component.scss']
})
export class EventFighterComponent implements OnInit {
  @Input() fighter!: any;
  @Input() contestYear: string;
  @Input() set: string = '';
  core: any = {};
  rare: any = {};
  elite: any = {};
  legendary: any = {};
  reignmaker: any = {};
  collected: any = {};

  constructor(
    public collectionService: CollectionService,
  ) { }

  ngOnInit(): void {
    this.updateFighterDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.collected = {};
    this.updateFighterDetails();
  }

  updateFighterDetails(): void {
    const cards = this.fighter.details ? this.fighter.details[this.contestYear] : null;
    if (cards) {
      this.core = this.getCheapestCardBySet(cards.core);
      this.rare = this.getCheapestCardBySet(cards.rare);
      this.elite = this.getCheapestCardBySet(cards.elite);
      this.legendary = this.getCheapestCardBySet(cards.legendary);
      this.reignmaker = this.getCheapestCardBySet(cards.reignmaker);
    } else {
      this.core = this.rare = this.elite = this.legendary = this.reignmaker = {};
    }

    const collectionType: CollectionType = this.contestYear === '2024' ? CollectionType.UFC24 : CollectionType.UFC23;
    
    const cardsOwned = this.collectionService.fighterCardsOwned(this.fighter.name, collectionType);
    cardsOwned.forEach((card: any) => {
      if (this.collected[card.rarity]) {
        this.collected[card.rarity] += 1;
      } else {
        this.collected[card.rarity] = 1;
      }
    });
  }

  getCheapestCardBySet(cards: any): any {
    if (!this.set && Object.keys(cards).length) {
      return Object.values(cards).reduce(function(res: any, obj: any) {
        return (obj.price < res.price) ? obj : res;
      });
    }
    return Object.keys(cards).length ? cards[this.set] : null
  }
}
