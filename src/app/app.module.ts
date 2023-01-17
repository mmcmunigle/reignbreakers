;
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-dashboard.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CollectionOverviewComponent } from './components/collection-overview/collection-overview.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { UfcEventsComponent } from './components/ufc-events/ufc-events.component';
import { CollectionCountPipe } from './pipes/collection-count.pipe';
import { CollectionSpendPipe } from './pipes/collection-spend.pipe';
import { CollectionValuePipe } from './pipes/collection-value.pipe';
import { EventFighterComponent } from './components/event-fighter/event-fighter.component';
import { ContestsComponent } from './components/contests/contests.component';


@NgModule({
  declarations: [
    AppComponent,
    InventoryDashboardComponent,
    PlayerCardComponent,
    CollectionOverviewComponent,
    CollectionCountPipe,
    CollectionSpendPipe,
    CollectionValuePipe,
    UfcEventsComponent,
    EventFighterComponent,
    ContestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
