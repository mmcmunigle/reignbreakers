;
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'; 
import { MatTableModule } from '@angular/material/table';

import { RouterModule } from '@angular/router';
import { CardFilterComponent } from './components/card-filter/card-filter.component';
import { CollectionOverviewComponent } from './components/collection-overview/collection-overview.component';
import { ContestsComponent } from './components/contests/contests.component';
import { EventFighterComponent } from './components/event-fighter/event-fighter.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { UfcEventsComponent } from './components/ufc-events/ufc-events.component';
import { CollectionCountPipe } from './pipes/collection-count.pipe';
import { CollectionSpendPipe } from './pipes/collection-spend.pipe';
import { CollectionValuePipe } from './pipes/collection-value.pipe';
import { PgaRankingsComponent } from './components/pga-rankings/pga-rankings.component';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';

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
    ContestsComponent,
    CardFilterComponent,
    PgaRankingsComponent,
    InventoryTableComponent
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
    MatSidenavModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LayoutModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
