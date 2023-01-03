import { Component, Input, OnInit } from '@angular/core';
import { PlayerCard } from 'src/app/interfaces/player-card';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {
  @Input() card!: PlayerCard;
  constructor() {
    console.log(this.card)
  }

  ngOnInit(): void {
  }

}
