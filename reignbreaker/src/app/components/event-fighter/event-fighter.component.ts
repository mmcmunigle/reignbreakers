import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    if (this.fighter.details) {
      this.core = this.fighter.details.core.price;
      this.rare = this.fighter.details.rare.price;
      this.elite = this.fighter.details.elite.price;
      this.legendary = this.fighter.details.legendary.price;
      this.reignmaker = this.fighter.details.reignmaker.price;
    }
  }

}
