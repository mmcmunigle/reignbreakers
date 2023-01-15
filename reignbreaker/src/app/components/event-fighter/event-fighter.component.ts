import { Component, Input, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-event-fighter',
  templateUrl: './event-fighter.component.html',
  styleUrls: ['./event-fighter.component.scss']
})
export class EventFighterComponent implements OnInit {
  @Input() fighter!: any;
  core!: number;
  rare!: number;
  elite!: number;
  legendary!: number;
  reignmaker!: number;
  collected: any = {};

  constructor(
    public collectionService: CollectionService,
  ) { }

  ngOnInit(): void {
    const cards = this.fighter.details
    if (this.fighter.details) {
      this.core = cards.core.length ? cards.core[0].price : null;
      this.rare = cards.rare.length ? cards.rare[0].price : null;
      this.elite = cards.elite.length ? cards.elite[0].price : null;
      this.legendary = cards.legendary.length ? cards.legendary[0].price : null;
      this.reignmaker = cards.reignmaker.length ? cards.reignmaker[0].price : null;
    }

    setTimeout(() => {
      const cardsOwned = this.collectionService.fighterCardsOwned(this.fighter.name, "genesis");
      cardsOwned.forEach((card: any) => {
        this.collected[card.rarity] = true;
      });
    }, 1000);
    
  }

}
