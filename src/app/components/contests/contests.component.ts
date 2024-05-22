import { Component, OnInit } from '@angular/core';
import { CollectionType } from 'src/app/enums/collection-type';
import { ReignbreakerApiService } from 'src/app/services/reinbreaker-api.service';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.scss']
})
export class ContestsComponent implements OnInit {
  rankedFighters: any;
  merchandise: any;
  collected: any = {
    core: 0,
    rare: 0,
    elite: 0,
    legendary: 0,
    reignmaker: 0,
  }
  constructor(
    public apiService: ReignbreakerApiService,
    public collectionService: CollectionService,
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.apiService.getUfcMarketData('2024')
      .subscribe((merchandise: any) => {
        this.merchandise = merchandise;
      });
    }, 30000)

    this.apiService.getUfcMarketData('2024')
    .subscribe((merchandise: any) => {
      this.merchandise = merchandise;
    });

    this.apiService.getRankedFighters()
    .subscribe((fighters: any) => {
      this.rankedFighters = fighters;
      this.rankedFighters.forEach((fighter: any) => {
        const cards = this.collectionService.fighterCardsOwned(fighter.name, CollectionType.UFC_2024, 'Genesis');
        this.collected.core += cards.filter((card: any) => card.rarity == 'core').length ? 1 : 0;
        this.collected.rare += cards.filter((card: any) => card.rarity == 'rare').length ? 1 : 0;
        this.collected.elite += cards.filter((card: any) => {
          return card.rarity == 'elite' || card.rarity == 'legendary' || card.rarity == 'reignmaker'
        }).length ? 1 : 0;
      });
    });
  }
}
