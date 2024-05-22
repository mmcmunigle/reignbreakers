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
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort'; 
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

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
import { CollectionOfferPipe } from './pipes/collection-offer.pipe';
import { PgaRankingsComponent } from './components/pga-rankings/pga-rankings.component';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';
import { CollectionComponent } from './components/collection/collection.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryDashboardComponent,
    PlayerCardComponent,
    CollectionOverviewComponent,
    CollectionCountPipe,
    CollectionSpendPipe,
    CollectionValuePipe,
    CollectionOfferPipe,
    UfcEventsComponent,
    EventFighterComponent,
    ContestsComponent,
    CardFilterComponent,
    PgaRankingsComponent,
    InventoryTableComponent,
    CollectionComponent
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
    MatSlideToggleModule,
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
