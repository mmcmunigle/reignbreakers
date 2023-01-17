import { Component, Input, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-event-fighter',
  templateUrl: './event-fighter.component.html',
  styleUrls: ['./event-fighter.component.scss']
})
export class EventFighterComponent implements OnInit {
  @Input() fighter!: any;
  @Input() set: string = 'Genesis';
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
      const cardsOwned = this.collectionService.fighterCardsOwned(this.fighter.name, "Genesis");
      cardsOwned.forEach((card: any) => {
        this.collected[card.rarity] = true;
      });
    }, 1000);
  }

  cardBySet(cards: any): any {
    return cards ? cards[this.set] : null
  }
}
