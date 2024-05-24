import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import { CollectionType } from 'src/app/enums/collection-type';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-event-fighter',
  templateUrl: './event-fighter.component.html',
  styleUrls: ['./event-fighter.component.scss'],
})

export class EventFighterComponent implements OnInit {
  @Input() fighter!: any;
  @Input() contestYear: string;
  @Input() set: string = '';

  public core: any = {};
  public rare: any = {};
  public elite: any = {};
  public legendary: any = {};
  public reignmaker: any = {};
  public collected: any = {};

  public chart: any;
  public chartId: string = Math.random().toString();

  constructor(
    public collectionService: CollectionService,
  ) { }

  ngOnInit(): void {
    this.updateFighterDetails();

    this.collectionService.collectionUpdated.subscribe((value) => {
      this.mapFightersInCollection();
    });
  }

  ngAfterViewInit(): void {
    // this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.collected = {};
    this.updateFighterDetails();
  }

  createChart(){

    this.chart = new Chart(this.fighter.name, {
      type: 'doughnut',
      data: {
        labels: ['KO/SUB','DEC'],
        datasets: [{
          // label: 'My First Dataset',
          data: [this.fighter.vote.tko_percentage + this.fighter.vote.sub_percentage, this.fighter.vote.dec_percentage],
          backgroundColor: [
            'green',
            'orange'
          ],
        }],
      },
      options: {
        aspectRatio: 3,
        plugins: {
          legend: {
              display: false
          },
        },
        elements: {
          arc: {
              borderWidth: 0,
          }
        }
      }

    });
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

    this.mapFightersInCollection();
  }

  private mapFightersInCollection(): void {
    const collectionType: CollectionType = this.contestYear === '2024' ? CollectionType.UFC_2024 : CollectionType.UFC_2023;
    
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
