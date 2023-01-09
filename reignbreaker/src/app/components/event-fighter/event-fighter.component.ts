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
    if (this.fighter.details) {
      this.core = this.fighter.details.core.price;
      this.rare = this.fighter.details.rare.price;
      this.elite = this.fighter.details.elite.price;
      this.legendary = this.fighter.details.legendary.price;
      this.reignmaker = this.fighter.details.reignmaker.price;
    }

    setTimeout(() => {
      const cardsOwned = this.collectionService.fighterCardsOwned(this.fighter.name);
      cardsOwned.forEach((card: any) => {
        this.collected[card.rarity.toLowerCase()] = true;
      });
    }, 1000);
    
  }

}
