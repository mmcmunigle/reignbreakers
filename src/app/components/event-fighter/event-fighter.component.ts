import { Component, Input, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-event-fighter',
  templateUrl: './event-fighter.component.html',
  styleUrls: ['./event-fighter.component.scss']
})
export class EventFighterComponent implements OnInit {
  @Input() fighter!: any;
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
    const cards = this.fighter.details
    if (this.fighter.details) {
      this.core = this.cardBySet(cards.core);
      this.rare = this.cardBySet(cards.rare);
      this.elite = this.cardBySet(cards.elite);
      this.legendary = this.cardBySet(cards.legendary);
      this.reignmaker = this.cardBySet(cards.reignmaker);
    }

    setTimeout(() => {
      const cardsOwned = this.collectionService.fighterCardsOwned(this.fighter.name);
      cardsOwned.forEach((card: any) => {
        if (this.collected[card.rarity]) {
          this.collected[card.rarity] += 1;
        } else {
          this.collected[card.rarity] = 1;
        }
      });
    }, 200);
  }

  cardBySet(cards: any): any {
    if (!this.set && Object.keys(cards).length) {
      return Object.values(cards).reduce(function(res: any, obj: any) {
        return (obj.price < res.price) ? obj : res;
      });
    }
    return Object.keys(cards).length ? cards[this.set] : null
  }
}
