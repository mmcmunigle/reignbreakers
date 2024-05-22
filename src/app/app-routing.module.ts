import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestsComponent } from './components/contests/contests.component';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-dashboard.component';
import { PgaRankingsComponent } from './components/pga-rankings/pga-rankings.component';
import { UfcEventsComponent } from './components/ufc-events/ufc-events.component';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';
import { CollectionComponent } from './components/collection/collection.component';

const routes: Routes = [
  { path: '', component: UfcEventsComponent },
  { path: 'contests', component: ContestsComponent },
  { path: 'pga-rankings', component: PgaRankingsComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'collection-table', component: InventoryTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
