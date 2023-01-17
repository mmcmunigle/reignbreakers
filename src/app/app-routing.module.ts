import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestsComponent } from './components/contests/contests.component';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-dashboard.component';
import { UfcEventsComponent } from './components/ufc-events/ufc-events.component';

const routes: Routes = [
  { path: 'events', component: UfcEventsComponent },
  { path: '', component: ContestsComponent },
  { path: 'inventory', component: InventoryDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
